const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const connectDB = require('./config/db');
const userRoutes =  require ('./routes/userRoutes');
const app = express();
connectDB()
app.use(express.json())
const PORT = process.env.PORT;

app.use('/api/user', userRoutes)

app.listen(PORT,()=>{
    console.log(`Server started on port ${PORT}`)

})

module.exports = app;
