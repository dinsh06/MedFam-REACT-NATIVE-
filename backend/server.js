const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("./models/user");  // Use require to import the User model

dotenv.config();

const app = express();
const port = 5000;

app.use(express.json()); 
app.use(cors());  

mongoose
  .connect("mongodb+srv://dynesh:dinesh@cluster0.9copt.mongodb.net/ecom", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to database");
  })
  .catch((err) => {
    console.error("Failed to connect to DB", err);
  });

const authenticateJWT = (req, res, next) => {
    console.log("Auth Middleware - Checking Authorization Header");
    const token = req.headers["authorization"];
    console.log(token);
    if (!token || !token.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Access denied, token missing or incorrect" });
    }
    const tokenWithoutBearer = token.split(" ")[1]; 
    jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        console.log("Error verifying token:", err);
        return res.status(403).json({ success: false, message: "Token is not valid" });
      }
        req.user = user;
      next(); 
    });
  };  

app.post("/login", async(req,res) =>{
    try{
        const {email,password} = req.body;
        const user = await User.findOne({email,password});
        if(!user||user.password!=password){
            return res.status(401).json({success: false,message:"error logging in"});
        }
        console.log(process.env.JWT_SECRET);
        const token = jwt.sign({userID:user._id,email:user.email},process.env.JWT_SECRET,{expiresIn:"7d"});
        return res.json({success: true, token});
    } catch(error) {
        console.error("Error logging in", error);
    }
});

app.get("/templates", authenticateJWT, async (req, res) => {
    console.log("Received request for templates fetching");

    try {
        const userID = req.user.userID;  // Get the user ID from the JWT token
        console.log(userID);

        const user = await User.findById(userID);  // Find the user in the database using the userID

        if (!user) {
            console.log("User not found with ID:", userID);
            return res.status(404).json({ success: false, message: "User not found" });
        }

        console.log('User found');
        console.log(user.templates.medicines);
        return res.json({ success: true, templates: user.templates });  // Return the templates for the user
    } catch (error) {
        console.error("Error fetching templates data:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
});

  app.get("/cart", authenticateJWT, async (req, res) => {
    console.log("Cart Route - Received GET request");
    try {
      const userId = req.user.userID; 
      console.log("Cart request for user ID:", userId);
      const user = await User.findById(userId);
      if (!user) {
        console.log("User not found with ID:", userId);
        return res.status(404).json({ success: false, message: "User not found" });
      } 
      console.log("User found, returning cart data:", user.cart);
      return res.json({ success: true, cart: user.cart });
    } catch (error) {
      console.error("Error fetching cart data:", error);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  });

  app.post("/cart/update", authenticateJWT, async (req, res) => {
    console.log("Cart Update Route - Received POST request");
    console.log("Received body:", req.body);
    const { itemId, quantityChange } = req.body;
    if (typeof quantityChange !== "number" || !itemId) {
      return res.status(400).json({ success: false, message: "Invalid input" });
    }
    try {
        const userId = req.user.userID; 
        const user = await User.findById(userId);
        if (!user) {
          return res.status(404).json({ success: false, message: "User not found" });
        }
        const itemIndex = user.cart.findIndex((item) => item.name.toString() === itemId);
        if (itemIndex === -1) {
          return res.status(404).json({ success: false, message: "Item not found in cart" });
        }
        const item = user.cart[itemIndex];
        if (item.quantity + quantityChange < 1) {
          return res.status(400).json({ success: false, message: "Cannot have less than 1 item" });
        }
        item.quantity += quantityChange;
        await user.save();
        console.log('updated the item quantity');
        return res.json({ success: true, cart: user.cart });
    } catch (err) {
      console.error("Error updating cart:", err);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  });  

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });