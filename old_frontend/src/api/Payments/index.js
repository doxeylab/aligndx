import useAxios from '../useAxios'

const payments_endpoint = "payments"

export const usePayments = () => {
    const {get, post, put, delete: destroy } = useAxios();

    return {
    get_active_subscription: (params) => 
        get(`${payments_endpoint}/subscriptions`, params),
    create_subscription: (params) => 
        post(`${payments_endpoint}/subscriptions`, params),
    get_all_plans: (params) => 
        get(`${payments_endpoint}/plans`, params),
    get_settings_page_data: (params) => 
        get(`${payments_endpoint}/settings`, params),
    change_plan: (params) => 
        put(`${payments_endpoint}/subscriptions/change-plan`, params),
    cancel_change_plan: (params) => 
        destroy(`${payments_endpoint}/subscriptions/change-plan`, params),
    update_payment_method: (params) => 
        get(`${payments_endpoint}/update-card/secret`, params),
    cancel_subscription: (params) => 
        destroy(`${payments_endpoint}/subscriptions`, params),
    reactivate_subscription: (params) =>
        put(`${payments_endpoint}/subscriptions`, params),
    }

}
