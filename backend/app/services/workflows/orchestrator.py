from .commands import CommandGenerator
from .executors import DockerExecutor
from app.services.storages import StorageManager
from app.models.stores import BaseStores
from app.models.workflows import WorkflowSchema


class WorkflowOrchestrator:
    def __init__(self):
        self.executor = DockerExecutor()
        self.storage = StorageManager()

    def get_workflows(self):
        return self.storage.list_folders(store=BaseStores.WORFKLOWS)

    def get_workflow(self, workflow_id: str):
        workflow_schema = f"{workflow_id}/schema.yml"
        data = self.storage.read(store=BaseStores.WORFKLOWS, filename=workflow_schema)
        return WorkflowSchema(**data)

    def create_job(self, workflow_id: str, user_inputs: dict, submission_id):
        workflow = self.get_workflow(workflow_id)
        command_generator = CommandGenerator(workflow, submission_id)
        image = workflow.config.image
        launch_command = command_generator.generate_command(user_inputs)
        job_id = self.executor.create(image=image, launch_command=launch_command)
        return job_id

    def run_job(self, job_id):
        self.executor.run(job_id)

    def get_job_logs(self, job_id):
        self.executor.logs(job_id)

    def get_job_status(self, job_id):
        self.executor.status(job_id)

    def complete_job(self, job_id):
        self.executor.destroy(job_id)
