from .commands import CommandGenerator
from .executors import DockerExecutor


class WorkflowOrchestrator:
    def __init__(self):
        self.executor = DockerExecutor()

    def get_workflow(self, workflow_id: str):
        pass

    def create_job(self, workflow_id: str, user_inputs: dict):
        workflow = self.get_workflow(workflow_id)
        command_generator = CommandGenerator(workflow)
        image = workflow["config"]["image"]
        launch_command = command_generator.generate_command(user_inputs)
        job_id = self.executor.create(image=image, launch_command=launch_command)
        return job_id

    def run_job(self, job_id):
        self.executor.run(job_id=job_id)

    def get_job_logs(self, job_id):
        self.executor.logs(job_id=job_id)

    def get_job_status(self, job_id):
        self.executor.status(job_id=job_id)

    def complete_job(self, job_id):
        self.executor.destroy(job_id=job_id)
