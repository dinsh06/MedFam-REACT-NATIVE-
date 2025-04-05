const mongoose = require("mongoose");

// Cart Schema: Contains the list of medicines in the cart with name, price, and quantity
const cartSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
});

// Template Schema: Contains the template data for the user's profile
const templateSchema = new mongoose.Schema({
  tempname: {
    Address: { type: String, required: true },
    Name: { type: String, required: true },
    Phone: { type: String, required: true },
    mail: { type: String, required: true },
  },
  medicines: [
    {
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
    },
  ],
});

// Address Schema: Contains the user's address information
const addressSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  pincode: { type: String, required: true },
  housenumber: { type: String, required: true },
  buildingname: { type: String, required: true },
  roadname: { type: String, required: true },
  area: { type: String, required: true },
  Locality: { type: String, required: true },
});

// User Schema: Contains the user's credentials, cart, template, and addresses
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  cart: [cartSchema],  // Embedding cart schema directly into the user schema
  templates: [templateSchema],  // Embedding template schema for the user's templates
  addresses: [addressSchema],  // Embedding address schema for the user's multiple addresses
});

// Create a model from the user schema
const User = mongoose.model("user_details", userSchema);

module.exports = User;
