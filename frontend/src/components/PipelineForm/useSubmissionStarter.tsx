import { useMutation } from '@tanstack/react-query'
import { useSubmissions } from '../../api/Submissions'

export default function useSubmissionStarter(onSuccess?: any, onError?:any){
    const submissions = useSubmissions();

    return useMutation({
        retry: 1,
        mutationFn: (data) => submissions.start(data),
        onSuccess,
        onError
    })
}