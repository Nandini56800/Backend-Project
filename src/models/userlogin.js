const mongoose = require("mongoose");
const validator=require("validator");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const { response } = require("express");
const regSchema= new mongoose.Schema({
    name: {
        type: String,
        required : true,
    },
    email:{
        type: String,
        required : true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid Email id")
            }
        }
    },
    password:{
         type:String,
         required:true
    },
    confirmpassword:{
        type:String,
        required:true
   },
    
    date:{
        type:Date,
        default:Date.now
    },
    tokens:[{
        token:{
        type:String,
        required:true
        }
    }]
})
   
regSchema.methods.genToken=async function(){
    try{
        const token=jwt.sign({_id:this._id.toString()},process.env.SECRET_KEY);
        this.tokens=this.tokens.concat({token:token});
        await this.save();
        return token;
    }catch(error){
        res.send(error);
    }
}

regSchema.pre("save",async function(next){
    if(this.isModified("password")){

    this.password = await bcrypt.hash(this.password,10);
    this.confirmpassword=await bcrypt.hash(this.password,10);
    }
    next();
})
const Reg = new mongoose.model("Reg",regSchema);

module.exports = Reg ;

