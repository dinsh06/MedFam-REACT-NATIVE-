const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("./models/user"); 
const Product = require("./models/product");
const Razorpay = require('razorpay');
const crypto = require('crypto'); 

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

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
        return res.status(403).json({ success: false, message: "Please log in" });
      }
        req.user = user;
      next(); 
    });
  };  
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  app.post('/create-order', authenticateJWT, async (req, res) => {
    const { cartItems, totalPrice } = req.body;
  
    try {
      // Create an order on Razorpay
      const options = {
        amount: totalPrice * 100, // Amount in paise
        currency: 'INR',
        receipt: crypto.randomBytes(10).toString('hex'),
        payment_capture: 1,
      };
  
      const order = await razorpay.orders.create(options);
      console.log(order);
      return res.json({ success: true, order });
    } catch (error) {
      console.error("Error creating Razorpay order", error);
      return res.status(500).json({ success: false, message: 'Failed to create Razorpay order' });
    }
  });

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

app.get("/product", async (req, res) => {
  try {
    const products = await Product.find(); 
    return res.json({ success: true, products });
  } catch (error) {
    console.error("Error fetching product names:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

app.get("/product/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});


app.get("/search", async (req, res) => {
  const searchQuery = req.query.q || ""; // Read the query param `q`

  try {
    const regex = new RegExp(searchQuery, "i"); // Case-insensitive match
    const products = await Product.find({
      $or: [
        { name: regex },
        { brand: regex },
        { category: regex },
        { shortDesc: regex },
        { composition: regex },
      ],
    });

    return res.json({ success: true, products });
  } catch (error) {
    console.error("Error fetching product names:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});


app.get("/user/address", authenticateJWT, async (req, res) => {
  try {
    const userID = req.user.userID; // Get the user ID from the JWT token
    if (!userID) {
      return res.status(400).json({ success: false, message: "User ID not found in the token" });
    }

    const user = await User.findById(userID); // Find the user in the database using the userID
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // If the user has no addresses, return an empty array
    if (!user.addresses || user.addresses.length === 0) {
      return res.json({ success: true, addresses: [] });
    }

    // Construct formatted address
    const formattedAddresses = user.addresses.map(address => ({
      ...address.toObject(), // Convert Mongoose document to plain object to ensure proper formatting
      formattedAddress: `${address.housenumber}, ${address.buildingname}, ${address.roadname}, ${address.area}, ${address.locality}, ${address.pincode}`
    }));

    console.log(formattedAddresses);

    return res.json({ success: true, addresses: formattedAddresses });
  } catch (error) {
    console.error(error); // Log the error for debugging
    return res.status(500).json({ success: false, message: "Server error" });
  }
});
app.get("/product/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.delete("/template/:tempname", authenticateJWT, async (req, res) => {
  try {
    const userID = req.user.userID;
    const { tempname } = req.params;

    const user = await User.findById(userID);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const initialLength = user.templates.length;
    user.templates = user.templates.filter(template => template.tempname !== tempname);

    if (user.templates.length === initialLength) {
      return res.status(404).json({ success: false, message: "Template not found" });
    }

    await user.save();
    return res.json({ success: true, message: "Template removed successfully" });
  } catch (error) {
    console.error("Error removing template:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

app.get("/search", async (req, res) => {
  const searchQuery = req.query.q || ""; // Read the query param q

  try {
    const regex = new RegExp(searchQuery, "i"); // Case-insensitive match
    const products = await Product.find({
      $or: [
        { name: regex },
        { brand: regex },
        { category: regex },
        { shortDesc: regex },
        { composition: regex },
      ],
    });

    return res.json({ success: true, products });
  } catch (error) {
    console.error("Error fetching product names:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});
app.post("/getMedicinesPrices", async (req, res) => {
  console.log("req recieved to fetch the medicine prices");
  const { medicines } = req.body; // Get the list of medicines from the request body
  console.log("Received medicines:", medicines);  // Log received medicines

  try {
    const notFoundMedicines = [];
    const prices = [];

    for (let medicineName of medicines) {
      console.log("Searching for medicine:", medicineName); // Log each medicine name being searched

      const product = await Product.findOne({ brand: medicineName });
      if (product) {
        console.log(`Found product: ${medicineName} with price ${product.price}`); // Log found product and price
        prices.push(product.price);
      } else {
        console.log(`Product not found for: ${medicineName}`); // Log if product is not found
        prices.push(null); // No price if product is not found
        notFoundMedicines.push(medicineName);
      }
    }

    if (notFoundMedicines.length > 0) {
      console.log("Medicines not found:", notFoundMedicines); // Log medicines not found
      return res.json({
        success: true,
        notFoundMedicines, // Send list of medicines not found
        prices, // Send the prices (null for not found medicines)
      });
    } else {
      console.log("All medicines found, prices:", prices); // Log prices if all medicines were found
      return res.json({
        success: true,
        prices, // Send all the prices for the found medicines
        notFoundMedicines: [], // Empty array if all medicines were found
      });
    }
  } catch (error) {
    console.error("Error fetching medicine prices:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

app.post("/saveTemplate", authenticateJWT, async (req, res) => {
  try {
    console.log("Saving template...");

    const userId = req.user.userID; // Get the user ID from the JWT token
    console.log("User ID:", userId); // Log the user ID

    const { tempname, Name, Address, Phone, mail, medicines } = req.body;
    console.log("Received template data:", { tempname, Name, Address, Phone, mail, medicines });

    const user = await User.findById(userId);
    if (!user) {
      console.log("User not found"); // Log if user is not found
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Save the new template to the user's templates
    const newTemplate = {
      tempname,
      Name,
      Address,
      Phone,
      mail,
      medicines, // This will include the medicines with their prices
    };

    console.log("New template data:", newTemplate); // Log the new template data to be saved

    user.templates.push(newTemplate);
    await user.save();

    console.log("Template saved successfully"); // Log after successful saving

    return res.json({ success: true, message: "Template saved successfully" });
  } catch (error) {
    console.error("Error saving template:", error);
    return res.status(500).json({ success: false, message: "Server error" });
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
          // If quantity is less than 1, remove the item from the cart
          user.cart.splice(itemIndex, 1);
          await user.save();
          console.log("Item removed from cart because quantity is less than 1");
          return res.json({ success: true, cart: user.cart });
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


  app.post("/cart/add", authenticateJWT, async (req, res) => {
    console.log("Received request for adding item to cart");
  
    const { name, price, quantity, image } = req.body;
    console.log("Received item details:", name, price, quantity, image);
  
    if (!name || !price || !quantity) {
      return res.status(400).json({ success: false, message: "One or more of the inputs are missing" });
    }
  
    try {
      const userId = req.user.userID;
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
      // Check if the product is already in the user's cart
      const existingProduct = user.cart.find(item => item.name === name);
  
      if (existingProduct) {
        // Product already in cart, update the quantity
        existingProduct.quantity += quantity;
      } else {
        // Product not in cart, add it as a new item
        user.cart.push({ name, price, quantity, image });
      }
  
      await user.save(); // Save the updated user document
  
      return res.json({ success: true, cart: user.cart }); // Return the updated cart
    } catch (err) {
      console.error("Error adding to cart:", err);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  });  

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });