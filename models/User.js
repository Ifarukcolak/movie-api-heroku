const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const UserSchema=new Schema({
    username:{
        type:String,
        required:true,
        minlength:5,
        maxlength:30,
        unique:true
    },
    password:{
        type:String,
        required:true,
        minlength:5,
        maxlength:500
    }
});

module.exports=mongoose.model('user',UserSchema);