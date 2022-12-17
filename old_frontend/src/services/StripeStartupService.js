import { URL } from '../config/Settings'

const fetchStripeKey = async () => {
    let stripe_key;
    try {
        const { key } = await fetch(`${URL}stripe-key`).then(r => r.json())
        stripe_key = key
    } catch (error) {
        console.error('Stripe publishable key not found')
        stripe_key = ''
    }
    return stripe_key;
}

export default fetchStripeKey;