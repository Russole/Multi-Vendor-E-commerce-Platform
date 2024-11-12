const express = require('express');
const app = express();

require('dotenv').config(); // Load .env file environmental variable

const cors = require('cors')
const bodyParser = require('body-parser') // Parse JSON data in the request
const cookieParser = require('cookie-parser') // Parse and handle cookies in the request
const { dbConnect } = require('./utils/db')
app.use(cors({
    origin : ['http://localhost:3000'],
    credentials : true // cross-origin requests are allowed to carry authentication information (such as cookies)
})) // Middleware to handle cross-origin requests in CORS
    // It means that requests from only these two origins will be allowed

app.use(bodyParser.json())
app.use(cookieParser())

app.use('/api',require('./routes/authRoutes'))

app.get('/', (req,res)=>res.send('Hello Server'))
const port = process.env.PORT;

app.listen(port, () => console.log(`Server is running on port ${port}`))
dbConnect()