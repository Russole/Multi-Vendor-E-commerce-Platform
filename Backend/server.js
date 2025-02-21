const express = require('express');
const app = express();

require('dotenv').config(); // Load .env file environmental variable



const cors = require('cors')
const bodyParser = require('body-parser') // Parse JSON data in the request
const cookieParser = require('cookie-parser') // Parse and handle cookies in the request
const { dbConnect } = require('./utils/db')

const socket = require('socket.io')
const http = require('http')
const server = http.createServer(app)
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true // cross-origin requests are allowed to carry authentication information (such as cookies)
})) // Middleware to handle cross-origin requests in CORS
// It means that requests from only these two origins will be allowed

// app.use(cors({
//     origin: '*',
//     credentials: true
// }));

var allCustomer = []
var allSeller = []
let admin = {}

const io = socket(server, {
    cors: {
        origin: '*',
        credentials: true
    }
})

const addUser = (customerId, socketId, userInfo) => {
    const checkUser = allCustomer.some(u => u.customerId === customerId)
    console.log("checkUser")
    if (!checkUser) {
        allCustomer.push({
            customerId,
            socketId,
            userInfo
        })
    }
}

const addSeller = (sellerId, socketId, userInfo) => {
    const checkSeller = allSeller.some(u => u.sellerId === sellerId)
    if (!checkSeller) {
        allSeller.push({
            sellerId,
            socketId,
            userInfo
        })
    }
}

const findCustomer = (customerId) => {
    return allCustomer.find(c => c.customerId === customerId)
}

const findSeller = (sellerId) => {
    return allSeller.find(c => c.sellerId === sellerId)
}

const remove = (socketId) => {
    allCustomer = allCustomer.filter(c => c.socketId !== socketId)
    allSeller = allSeller.filter(c => c.socketId !== socketId)
}

io.on('connection', (soc) => {
    console.log('socket server running..')

    soc.on('add_user', (customerId, userInfo) => {
        console.log("Backend add_customer");
        addUser(customerId, soc.id, userInfo);
        console.log(allCustomer);
        io.emit('activeCustomer', allCustomer);
        io.emit('activeSeller', allSeller);
    })
    soc.on('add_seller', (sellerId, userInfo) => {
        console.log("Backend add_seller")
        addSeller(sellerId, soc.id, userInfo)
        console.log(allSeller)
        io.emit('activeSeller', allSeller)
    })
    soc.on('CheckExistCustomer', () => {
        console.log('Server Check Get Exist Customer');
        io.emit('activeCustomer', allCustomer);
    });
    soc.on('send_seller_message', (msg) => {
        // console.log(msg)
        const customer = findCustomer(msg.receverId)
        if (customer !== undefined) {
            soc.to(customer.socketId).emit('seller_message', msg)
        }
    })
    soc.on('send_customer_message', (msg) => {
        const seller = findSeller(msg.receverId)
        if (seller !== undefined) {
            soc.to(seller.socketId).emit('customer_message', msg)
        }
    })
    soc.on('add_admin', (adminInfo) => {
        delete adminInfo.email
        delete adminInfo.password
        admin = adminInfo
        admin.socketId = soc.id
        io.emit('activeSeller', allSeller)
    })
    soc.on('send_message_admin_to_seller', (msg) => {
        const seller = findSeller(msg.receverId)
        if (seller !== undefined) {
            soc.to(seller.socketId).emit('receved_admin_message', msg)
        }
    })
    // 處理登出事件
    soc.on('SellerLogout', () => {
        console.log('Seller logged out:', soc.id);
        remove(soc.id); // 執行斷線時的清理邏輯
        io.emit('activeSeller', allSeller); // 廣播更新後的活躍用戶清單
    });
    // 處理登出事件
    soc.on('CustomerLogout', () => {
        console.log('Customer logged out:', soc.id);
        remove(soc.id); // 執行斷線時的清理邏輯
        console.log(allCustomer)
        io.emit('activeCustomer', allCustomer); // 廣播更新後的活躍用戶清單
    });
    soc.on('disconnect', () => {
        console.log(`user disconnect soc id:${soc.id}`)
        remove(soc.id)
        console.log(`All Connected Seller${allSeller}`)
        io.emit('activeSeller', allSeller)
    })
    soc.on('send_message_seller_to_admin', (msg) => {
        if (admin.socketId) {
            soc.to(admin.socketId).emit('receved_seller_message', msg)
        }
    })

})


require('dotenv').config()

app.use(bodyParser.json())
app.use(cookieParser())

app.use('/api/home', require('./routes/home/homeRoutes'))
app.use('/api', require('./routes/authRoutes'))
app.use('/api', require('./routes/dashboard/categoryRoutes'))
app.use('/api', require('./routes/dashboard/productRoutes'))
app.use('/api', require('./routes/dashboard/sellerRoutes'))
app.use('/api', require('./routes/home/customerAuthRoutes'))
app.use('/api', require('./routes/home/cardRoutes'))
app.use('/api', require('./routes/order/orderRoutes'))
app.use('/api', require('./routes/chatRoutes'))
app.use('/api', require('./routes/paymentRoutes'))
app.use('/api', require('./routes/dashboard/dashboardRoutes'))

app.get('/', (req, res) => res.send('Hello Server'))
const port = process.env.PORT;
server.listen(port, () => console.log(`Server is running on port ${port}`))
dbConnect()
