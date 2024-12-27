const stripeModel = require('../../models/stripeModel');
const sellerModel = require('../../models/sellerModel')
const { v4: uuidv4 } = require('uuid');
const stripe = require('stripe')('sk_test_51QQ0s9D0Czud5bUaeKjI3gri5LFzcaYVfSdWk4HN4C8926y8NCQ0xFNREyaqZvGRj3paK6oid6F3Kzs0EkTG72wc00SjmjIH75');
const { responseReturn } = require('../../utils/response')
class paymentController {
    create_stripe_connect_account = async (req, res) => {
        const { id } = req
        const uid = uuidv4()
        console.log(`uid:${uid}`)
        try {
            const stripeInfo = await stripeModel.findOne({ sellerId: id })
            if (stripeInfo) {
                await stripeModel.deleteOne({ sellerId: id })
                const account = await stripe.accounts.create({ type: 'express' })
                const accountLink = await stripe.accountLinks.create({
                    account: account.id,
                    refresh_url: 'http://localhost:3001/refresh',
                    return_url: `http://localhost:3001/success?activeCode=${uid}`,
                    type: 'account_onboarding'
                })
                await stripeModel.create({
                    sellerId: id,
                    stripeId: account.id,
                    code: uid
                })
                responseReturn(res, 201, { url: accountLink.url })
            } else {
                const account = await stripe.accounts.create({ type: 'express' })
                const accountLink = await stripe.accountLinks.create({
                    account: account.id,
                    refresh_url: 'http://localhost:3001/refresh',
                    return_url: `http://localhost:3001/success?activeCode=${uid}`,
                    type: 'account_onboarding'
                })
                await stripeModel.create({
                    sellerId: id,
                    stripeId: account.id,
                    code: uid
                })
                responseReturn(res, 201, { url: accountLink.url })
            }

        } catch (error) {
            console.log('strpe connect account errror' + error.message)
        }
    }
    // End Method

    active_stripe_connect_account = async (req, res) => {
        const { activeCode } = req.params
        // console.log(`activeCode:${activeCode}`)
        const { id } = req
        try {
            const userStripeInfo = await stripeModel.findOne({ code: activeCode })
            if (userStripeInfo) {

                await sellerModel.findByIdAndUpdate(id, {
                    payment: 'active'
                })
                responseReturn(res, 200, { message: 'payment Active' })
            } else {
                responseReturn(res, 404, { message: 'payment Active Fails' })
            }
        } catch (error) {
            responseReturn(res, 500, { message: 'Internal Server Error' })
        }
    }
    // End Method
}
module.exports = new paymentController()