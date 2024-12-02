const mongoose = require('mongoose');
module.exports.dbConnect = async () => {
    console.log("dbConnect")
    try {
        await mongoose.connect(process.env.DB_URL, { useNewURLParser: true, useUnifiedTopology: true })
        console.log("Database connected..")
    } catch (error) {
        console.log(error.message)
    }
}