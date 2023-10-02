import { useQuery } from '@tanstack/react-query'
import { useSubmissions } from '../../api/Submissions'

export default function useSubmissionStarter(subId: any, onSuccess?: any, onError?:any){
    const submissions = useSubmissions();

    return useQuery({
        queryKey: ['sub_status', subId],
        retry: false,
        enabled: subId != null, 
        queryFn: () => subId ? submissions.get_submission(subId) : null,
        onSuccess,
        onError
    })
}