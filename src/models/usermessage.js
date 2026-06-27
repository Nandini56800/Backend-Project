const mongoose = require("mongoose");
const validator=require("validator")

const userSchema= new mongoose.Schema({
    name: {
        type: String,
        required : true
    },
    email:{
        type: String,
        required : true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid Email id")
            }
        }
    },
    phone:{
        type:Number,
        required:true,
        min:10
    },
    message: {
        type: String,
        required : true,
    },
    date:{
        type:Date,
        default:Date.now
    }
})
   

const UserRanking = new mongoose.model("UserRanking",userSchema);

module.exports = UserRanking ;

