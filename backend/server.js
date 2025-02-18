const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const jwt = require('jsonwebtoken');
require("dotenv").config(); 

app.use(express.json());  //middleware 
app.use(cors());  //cross origin res share
const port = 5000;

// mongodb+srv://dynesh:dinesh@cluster0.9copt.mongodb.net/ecom
mongoose.connect("mongodb+srv://dynesh:dinesh@cluster0.9copt.mongodb.net/ecom" ,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})
.then(()=>{
    console.log('connected to db');
}
)
.catch(err => {
    console.log('failed to connect to db', err);
});

const userschema = new mongoose.Schema({
    email: String,
    password: String
});
const user = mongoose.model("user_details",userschema);

app.post("/login", async(req,res) =>{
    try{
        const {email,password} = req.body;
        const User = await user.findOne({email,password});
        if(!User||User.password!=password){
            return res.status(401).json({success: false,message:"error logging in"});
        }
        console.log(process.env.JWT_SECRET);
        const token = jwt.sign({userID:User._id,email:User.email},process.env.JWT_SECRET,{expiresIn:"7d"});
        return res.json({success: true, token});
    } catch(error) {
        console.error("Error logging in", error);
    }
});

app.listen(port, () => console.log(`Server running on ${port}`));
