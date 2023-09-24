import docker

client = docker.from_env()


class DockerExecutor:
    def create(self, image, launch_command):
        container = client.containers.create(
            image=image,
            command=launch_command,
            detach=True,
            volumes=[
                "/var/run/docker.sock:/var/run/docker.sock",
            ],
        )
        return container.id

    def run(self, id):
        container = client.containers.get(id)
        container.start()
        return

    def status(self, id):
        container = client.containers.get(id)
        status = container.status
        if status == "exited":
            successful_containers = client.containers.list(
                all=True, filters={"exited": 0}
            )
            if any(x.id == id for x in successful_containers):
                status = "completed"
            else:
                status = "error"

        return status

    def logs(self, id):
        container = client.containers.get(id)
        return container.logs()

    def destroy(self, id):
        container = client.containers.get(id)
        container.remove()
        return
