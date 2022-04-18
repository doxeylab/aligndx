import useAxios from '../useAxios'

const payments_endpoint = "payments"

export const usePayments = () => {
    const {get, post, put, destroy } = useAxios();

    return {
    create_subscription: (params) => 
        post(`${payments_endpoint}/subscriptions`, params),
    get_all_plans: (params) => 
        get(`${payments_endpoint}/plans`, params),
    get_settings_page_data: (params) => 
        get(`${payments_endpoint}/settings`, params),
    }

}
