import { useQuery } from '@tanstack/react-query'
import { useMeta } from '../../../api/Meta'

export default function usePipelineMeta(onSuccess?: any, onError?:any){
    const meta = useMeta();
    return useQuery({
        queryKey: ['pipelineMeta'],
        retry: 1,
        queryFn: meta.get_pipelines,
        select: (data: any) => {
            const pipelines = data?.data
            const transformed = Object.keys(pipelines).map(key => pipelines[key])
            return transformed
        },
        onSuccess,
        onError
    })
}