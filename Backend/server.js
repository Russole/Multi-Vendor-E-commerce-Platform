const express = require('express');
const app = express();

require('dotenv').config(); // Load .env file environmental variable

app.use('/api',require('./routes/authRoutes'))

app.get('/', (req,res)=>res.send('My backend'))
const port = process.env.PORT;

app.listen(port, () => console.log(`Server is running on port ${port}`))