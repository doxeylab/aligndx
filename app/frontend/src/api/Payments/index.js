import useAxios from '../useAxios'

const payments_endpoint = "payments"

export const usePayments = () => {
    const {get, post, put, destroy } = useAxios();

    return {
    create_subscription: (params) => 
        post(`${payments_endpoint}/subscriptions`, params),
    }
}
