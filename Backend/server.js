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
    origin : ['http://localhost:3000'],
    credentials : true // cross-origin requests are allowed to carry authentication information (such as cookies)
})) // Middleware to handle cross-origin requests in CORS
    // It means that requests from only these two origins will be allowed

const io = socket(server, {
    cors: {
        origin: '*',
        credentials: true
    }
})

var allCustomer = []

const addUser = (customerId,socketId,userInfo) => {
    const checkUser = allCustomer.some(u => u.customerId === customerId)
    if (!checkUser) {
        allCustomer.push({
            customerId,
            socketId,
            userInfo
        })
    }
} 
io.on('connection', (soc) => {
    console.log('socket server running..')

    soc.on('add_user',(customerId,userInfo)=>{
        addUser(customerId,soc.id,userInfo)
         
   })
})
require('dotenv').config()

app.use(bodyParser.json())
app.use(cookieParser())

app.use('/api/home',require('./routes/home/homeRoutes'))
app.use('/api',require('./routes/authRoutes'))
app.use('/api',require('./routes/dashboard/categoryRoutes'))
app.use('/api',require('./routes/dashboard/productRoutes'))
app.use('/api',require('./routes/dashboard/sellerRoutes'))
app.use('/api',require('./routes/home/customerAuthRoutes'))
app.use('/api',require('./routes/home/cardRoutes'))
app.use('/api',require('./routes/order/orderRoutes'))
app.use('/api',require('./routes/chatRoutes'))

app.get('/', (req,res)=>res.send('Hello Server'))
const port = process.env.PORT;
server.listen(port, () => console.log(`Server is running on port ${port}`))
dbConnect()