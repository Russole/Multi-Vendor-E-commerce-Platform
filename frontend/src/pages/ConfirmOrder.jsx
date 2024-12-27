import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js'
const load = async () => {
    return await loadStripe('pk_test_51QQ0s9D0Czud5bUaPGUdwRuL7LGPG07G6Y6jo2Dz2LWMRdDDxMggBBM9m9qIVx8ZBWwNwh7CoPvFEWa5tlSxIqII003UPiNMhZ')
}
const ConfirmOrder = () => {
    const [loader, setLoader] = useState(true)
    const [stripe, setStripe] = useState('')
    const [message, setMessage] = useState(null)
    useEffect(() => {
        if (!stripe) {
            return
        }
        const clientSecret = new URLSearchParams(window.location.search).get('payment_intent_client_secret')
        if (!clientSecret) {
            return
        }
        stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
            switch (paymentIntent.status) {
                case "succeeded":
                    setMessage('succeeded')
                    break
                case "processing":
                    setMessage('processing')
                    break
                case "requires_payment_method":
                    setMessage('failed')
                    break
                default:
                    setMessage('failed')
            }
        })
    }, [stripe])
    const get_load = async () => {
        const tempStripe = await load()
        setStripe(tempStripe)
    }

    useEffect(() => {
        get_load()
    }, [])
    return (
        <div>
            oreder
        </div>
    );
};
export default ConfirmOrder;