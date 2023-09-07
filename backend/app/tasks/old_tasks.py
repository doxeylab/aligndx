@shared_task(
    name="Status Check",
    bind=True,
    autoretry_for=(StatusException,),
    max_retries=None,
    retry_kwargs={"max_retries": None, "countdown": 10},
)
def status_check(self, sub_id: str):
    metadata = retrieve.s(sub_id)()
    status = metadata.status
    container_status = factory.get_status(metadata.id)

    if status == "setup":
        if all([inp.status == "ready" for inp in metadata.inputs]):
            for inp in metadata.inputs:
                if inp.input_type == "file":
                    for filename, meta in inp.file_meta.items():
                        # Move and rename file to appropriate location
                        src = "{}/{}".format(metadata.store["raw_uploads"], meta.name)
                        dst = "{}/{}".format(metadata.store[inp.id], filename)
                        shutil.move(src=src, dst=dst)

                        info_id = meta.name + ".info"
                        info_src = "{}/{}".format(
                            metadata.store["raw_uploads"], info_id
                        )
                        info_dst = "{}/{}".format(metadata.store["temp"], info_id)
                        shutil.move(src=info_src, dst=info_dst)

            factory.start(metadata.id)
            metadata.status = "processing"
            update_metadata.s(sub_id, metadata)()

            raise StatusException(status)

        else:
            for inp in metadata.inputs:
                if inp.input_type == "file":
                    ready = [
                        meta.status == "finished"
                        for filename, meta in inp.file_meta.items()
                    ]
                    if all(ready):
                        inp.status = "ready"

            update_metadata.s(sub_id, metadata)()
            raise StatusException(status)

    if container_status == "completed" or container_status == "error":
        metadata.status = container_status
        update_metadata.s(sub_id, metadata).delay()
        status_update.s(sub_id, container_status).delay()
        factory.create_report(metadata)
        cleanup.s(sub_id, metadata).delay()
        return True

    raise StatusException(status)
