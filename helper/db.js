const mongoose=require('mongoose');
// load env variables
const dot_env=require('dotenv');
dot_env.config();

module.exports=()=>{
    mongoose.connect(process.env.MONGO_URI,{useUnifiedTopology: true,useNewUrlParser: true});

    mongoose.connection.on('open',()=>{
        //console.log('Db is connected');
    });
    mongoose.connection.on('error',(err)=>{
        console.log('Db is not connected : ',err);
    });
    
    mongoose.Promise=global.Promise;
};