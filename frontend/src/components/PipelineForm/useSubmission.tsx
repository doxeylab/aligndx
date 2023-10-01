// useSubmission.js
import { useMutation } from '@tanstack/react-query'
import { useSubmissions } from '../../api/Submissions'

const useSubmission = (type : string, onSuccess?: any, onError?: any) => {
  const submissions = useSubmissions();

  const mutationFn = type === 'starter' ? submissions.start : submissions.run;

  return useMutation({
    retry: 1,
    mutationFn,
    onSuccess,
    onError
  })
}

export default useSubmission;
