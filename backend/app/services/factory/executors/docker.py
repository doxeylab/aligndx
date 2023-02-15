import docker 
client = docker.from_env()

def create(image, command=None, **kwargs):
    container = client.containers.create(
        image=image,
        command=command,
        **kwargs
    )
    return container