    const mongoose = require ('mongoose');

    const connectDB = async()=>{
        try{
            await mongoose.connect(process.env.MONGODB_URI);
            console.log('mongoDB connected');
        }catch{
            console.error('MongoDB connection error:', error);
            process.exit(1);
        }
    }

    module.exports = connectDB;