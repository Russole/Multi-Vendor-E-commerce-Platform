const customerModel = require('../../models/customerModel')
const { responseReturn } = require('../../utils/response')
const bcrypt = require('bcryptjs')
const sellerCustomerModel = require('../../models/chat/sellerCustomerModel')
const { createToken } = require('../../utils/tokenCreate')

class customerAuthController {

    customer_register = async (req, res) => {
        const { name, email, password } = req.body

        try {
            const customer = await customerModel.findOne({ email })
            if (customer) {
                responseReturn(res, 404, { error: 'Email Already Exits' })
            } else {
                const createCustomer = await customerModel.create({
                    name: name.trim(), // .trim() 方法會移除以下字符, 空格（' '）, Tab 符號（\t）, 換行符（\n）, 回車符（\r）, 垂直制表符（\v）, 不可見的其他空白字符（例如 Unicode 的空白）
                    email: email.trim(),
                    password: await bcrypt.hash(password, 10),
                    method: 'menualy'
                })
                await sellerCustomerModel.create({
                    myId: createCustomer.id
                })
                const token = await createToken({
                    id: createCustomer.id,
                    name: createCustomer.name,
                    email: createCustomer.email,
                    method: createCustomer.method
                })
                res.cookie('customerToken', token, {
                    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                })
                responseReturn(res, 201, { message: "User Register Success", token })
            }
        } catch (error) {
            console.log(error.message)
        }
    }
    // End Method

    customer_login = async (req, res) => {
        const { email, password } = req.body

        try {
            const customer = await customerModel.findOne({ email }).select('+password') // .select('+password') : 選擇 'password' 字段，即使它的 select 選項為 false
            if (customer) {
                const match = await bcrypt.compare(password, customer.password) // 比較plain text 密碼和加密後的Hash Value
                if (match) {
                    const token = await createToken({ // jwt 簽名
                        id: customer.id,
                        name: customer.name,
                        email: customer.email,
                        method: customer.method
                    })
                    res.cookie('customerToken', token, { // cookies
                        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                    })
                    responseReturn(res, 201, { message: 'User Login Success', token })

                } else {
                    responseReturn(res, 404, { error: 'Password Wrong' })
                }
            } else {
                responseReturn(res, 404, { error: 'Email Not Found' })
            }

        } catch (error) {
            console.log(error.message)
        }
    }
    // End Method

    customer_logout = async (req, res) => {
        res.cookie('customerToken', "", {
            expires: new Date(Date.now())
        })
        responseReturn(res, 200, { message: 'Logout Success' })
    }
    // End Method
}

module.exports = new customerAuthController()
