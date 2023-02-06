import UppyFactory from "./UppyFactory";

interface UppyFactoryProps {
    id: string;
    meta?: Record<string, unknown>;
    fileTypes?: string[];
    refresh: any;
}

export default function Uploader({ id, meta, fileTypes, refresh }: UppyFactoryProps) {
    return UppyFactory({id, meta, fileTypes, refresh})
}