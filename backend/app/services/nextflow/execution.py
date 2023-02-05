"""Tools for representing Nextflow executions."""

import os
from pathlib import Path
import re
from datetime import datetime
from app.scripts.nextflow.utils import *

class Execution:
    """The record of the running of a Nextflow script. Upon initialisation all
    :py:class:`.ProcessExecution` objects will be generated.
    
    :param str location: the path where the execution took place and is saved.
    :param str id: the Nextflow ID assigned to the execution.
    """

    def __init__(self, log_location, history_location, id):
        self.log_location = log_location
        self.history_location = history_location

        self.id = id
        self.get_processes_from_log()
    

    @staticmethod
    def create_from_location(log_location, history_location):
        """Create a :py:class:`.Execution` object from its location alone (i.e.
        without knowing its Nextflow ID).
        
        :param str location: the path where the execution took place and is saved.
        :rtype: ``Execution``"""

        run_id = get_directory_id(log_location)
        return Execution(
            log_location=log_location, history_location=history_location, id=run_id
        )
    

    def __repr__(self):
        return f"<Execution [{self.id}]>"
    

    @property
    def history_data(self):
        """Gets the execution's data line from .nextflow/history as a list of
        values.
        
        :rtype: ``list``"""

        with open(os.path.join(self.history_location, ".nextflow", "history")) as f:
            lines = f.readlines()
        for line in lines:
            values = line.split("\t")
            if values[2] == self.id: return values

    
    @property
    def started_string(self):
        """The datetime at which the execution started as a string.

        :rtype: ``str``"""

        data = self.history_data
        if data: return data[0]
    

    @property
    def started_dt(self):
        """The datetime at which the execution started.

        :rtype: ``datetime``"""

        string = self.started_string
        if not string: return None
        return parse_datetime(string)
    

    @property
    def started(self):
        """The datetime at which the execution started as a UNIX timestamp.

        :rtype: ``float``"""

        dt = self.started_dt
        if not dt: return None
        return datetime.timestamp(dt)
    

    @property
    def duration_string(self):
        """How long the execution took to complete (as a string).
        
        :rtype: ``str``"""

        data = self.history_data
        if data: return data[1]
    

    @property
    def duration(self):
        """How long the execution took to complete in seconds.
        
        :rtype: ``float``"""

        string = self.duration_string
        if not string: return None
        return parse_duration(self.duration_string)
    

    @property
    def status(self):
        """The Nextflow reported status of the execution.
        
        :rtype: ``str``"""

        data = self.history_data
        if data: return data[3]
    

    @property
    def command(self):
        """The command used at the terminal to run the pipeline.

        :rtype: ``str``"""

        data = self.history_data
        if data: return data[6]
    

    @property
    def log(self):
        """Gets the full text of the execution's log file.

        :rtype: ``str``"""

        for filename in os.listdir(self.log_location):
            if ".nextflow.log" in filename:
                with open(os.path.join(self.log_location, filename)) as f:
                    text = f.read()
                    if f"[{self.id}]" in text: return text
    

    def get_processes_from_log(self):
        """Populates the process_executions list from data in the execution's
        log file.

        :rtype: ``list``"""

        log_text = self.log
        self.process_executions = []
        process_ids = re.findall(
            r"\[([a-f,0-9]{2}/[a-f,0-9]{6})\] Submitted process",
            log_text, flags=re.MULTILINE
        )
        for process_id in process_ids:
            fields = {
                "hash": process_id,
                "process": "",
                "name": get_process_name_from_log(log_text, process_id),
                "started_string": get_process_start_from_log(log_text, process_id),
                "started": None,
                "duration": 0,
                "status":  get_process_status_from_log(log_text, process_id),
                "bash": get_process_bash(self, process_id),
            }
            if "(" in fields["name"]:
                fields["process"] = fields["name"][:fields["name"].find("(") - 1]
            else:
                fields["process"] = fields["name"]
            fields["started"] = datetime.strptime(
                f"{str(datetime.now().year)}-{fields['started_string']}",
                "%Y-%b-%d %H:%M:%S.%f"
            )
            end_time = get_process_end_from_log(log_text, process_id)
            fields["duration"] = (end_time - fields["started"]).total_seconds()
            self.process_executions.append(
                ProcessExecution(execution=self, **fields)
            )

            

class ProcessExecution:
    """The record of the running of a process within a Nextflow execution.
    
    :param Execution execution: the Execution it took place within.
    :param str hash: the Nextflow ID assigned to the execution.
    :param str process: the process's name.
    :param str name: the process execution's name.
    :param str status: the process's reported status upon completion.
    :param str bash: the process's bash script.
    :param str started_string: the datetime the process started (as a string).
    :param str started_dt: the datetime the process started (as a datetime).
    :param float duration: how long the process ran for.
    """


    def __init__(self, execution, hash, process, name, status, bash, started_string, started, duration):
        self.execution = execution
        self.hash = hash
        self.process = process
        self.name = name
        self.status = status
        self.bash = bash
        self.started_string = started_string
        self.started_dt = started
        self.duration = duration
    

    def __repr__(self):
        return f"<ProcessExecution from {self.execution.id}: {self.name}>"
    

    @property
    def started(self):
        """The start time of the process execution as a UNIX timestamp.
        
        :rtype: ``float``"""
        
        return datetime.timestamp(self.started_dt)
    

    def input_data(self, include_path=True):
        """A list of files passed to the process execution as inputs.
        
        :param bool include_path: if ``False``, only filenames returned.
        :type: ``list``"""
        
        inputs = []
        directory = get_process_directory(self.execution, self.hash)
        try:
            with open(Path(f"{directory}/.command.run")) as f:
                stage = re.search(r"nxf_stage\(\)((.|\n|\r)+?)}", f.read())
        except FileNotFoundError: return []
        if stage:
            contents = stage[1]
            inputs = re.findall(r"ln -s (.+?) ", contents)
        if include_path:
            return inputs
        else:
            return [os.path.basename(f) for f in inputs]
    

    def all_output_data(self, include_path=True):
        """A list of all output data produced by the process execution,
        including unpublished staging files.

        :param bool include_path: if ``False``, only filenames returned.
        :type: ``list``"""

        outputs = []
        directory = get_process_directory(self.execution, self.hash)
        inputs = self.input_data(include_path=False)
        for f in os.listdir(directory):
            full_path = Path(f"{directory}/{f}")
            if not f.startswith(".command") and f != ".exitcode":
                if f not in inputs:
                    outputs.append(str(full_path) if include_path else f)
        return outputs