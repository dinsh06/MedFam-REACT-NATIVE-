const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

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

const userschema = new mongoose.Schema({},{strict:false});
const user = mongoose.model("user_details",userschema);

app.post("/submit", async(req,res) =>{
    try{
        const data = req.body;
        const newuser = new user(data);
        await newuser.save();
        res.status(201).json({message:"saved"});
    } catch(error) {
        console.error("error in saving", error);
    }
});

app.listen(port, () => console.log(`Server running on ${port}`));
