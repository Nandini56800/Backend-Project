require('dotenv').config();
const express = require('express');
require("./db/connection");
const UserRanking=require("./models/usermessage");
const Reg=require("./models/userlogin");
const app = express();
const path=require("path");
const hbs=require("hbs");
const bcrypt=require("bcryptjs");

const port=process.env.PORT || 3000;
const static_path="D:/Node/node_project/public";
const temp_path="D:/Node/node_project/templates/views";
const partials_path="D:/Node/node_project/templates/partials";
app.use('/css',express.static(path.join(__dirname,"../node_modules/bootstrap/dist/css")));
app.use('/js',express.static(path.join(__dirname,"../node_modules/bootstrap/dist/js")));
app.use('/jq',express.static(path.join(__dirname,"../node_modules/jquery/dist")));
app.set("view engine","hbs");
app.set("views",temp_path);
hbs.registerPartials(partials_path);
app.use(express.static(static_path));
app.use(express.urlencoded({extended:false}))
app.get("/",(req,res)=>{
    res.render("index");
});

app.get("/register",(req,res)=>{
    res.render("registration");
});
app.get("/login",(req,res)=>{
    res.render("login");
});
app.post("/register",async(req,res)=>{
    try{
        const password = req.body.password;
        const cpassword = req.body.confirmpassword;
        if(password===cpassword){
           const RegData=new Reg(req.body);

           const token = await RegData.genToken();


        await RegData.save();
        res.status(201).render("login");
        }
        else{
            res.send("password are not matching")
        }
    }catch(err){
        res.status(500).send(err);
    }
})
app.post("/login",async(req,res)=>{
    try{
        const email=req.body.email;
        const password = req.body.password;
        const useremail=await Reg.findOne({email:email});
        const isMatch=await bcrypt.compare(password,useremail.password);
        if(isMatch){
            const token = await useremail.genToken();
            console.log(token);
            res.status(201).render("index");
        }else{
            res.send("invalid login credentials");
        }

    }catch(err){
        res.status(400).send("invalid login credentials");
    }
})

app.post("/contact",async(req,res)=>{
    try{
        //res.send(req.body);
        const userData=new UserRanking(req.body);
        await userData.save();
        res.status(201).render("index");
    }catch(err){
        res.status(500).send(err);
    }
})
app.listen(port,()=>{
    console.log(`server running at port no. ${port}`);
})






















/*const jwt = require("jsonwebtoken");

const createToken = async()=>{
    const token = await jwt.sign({_id:"60c44ad174f86116c45f4326"},"iamsagniksahailiveinshyamnagarmyhobbyistoplaycricketaaaaaaaaaaaaaaaaa")
    console.log(token);
    const userserver = await jwt.verify(token,"iamsagniksahailiveinshyamnagarmyhobbyistoplaycricketaaaaaaaaaaaaaaaaa");
    console.log(userserver);
}

createToken();*/











/*const bcrypt=require("bcryptjs");

const securePassword=async(password)=>{
    const passwordHash=await bcrypt.hash(password,10);
    console.log(passwordHash);
    const passwordmatch=await bcrypt.compare("sagnik@123",passwordHash);
    console.log(passwordmatch);
}
securePassword("sagnik@123");*/
