from .commands import CommandGenerator
from .executors import DockerExecutor


class Orchestrator:
    def __init__(self):
        self.executor = DockerExecutor()

    def create_job(self, workflow: dict, user_inputs: dict):
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
