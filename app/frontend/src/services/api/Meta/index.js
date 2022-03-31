import { get, post, put, destroy } from '../Base'

const meta_endpoint = "metadata/"

export const Result = {
    get_panels: () => 
        get(`${meta_endpoint}/panels`),
}
