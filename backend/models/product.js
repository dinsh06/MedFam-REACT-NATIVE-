const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  category: { type: String, required: true },
  prescription: { type: Boolean, required: true }, // Whether the medicine is prescription-only
  ages: { type: String, required: true }, // Target age group
  quantity: { type: String, required: true }, // E.g., "Strip of 5 tablets"
  price: { type: Number, required: true }, // Price of the product
  shortDesc: { type: String, required: true }, // Short description of the product
  manufacturer: { type: String, required: true },
  composition: { type: String, required: true },
  storage: { type: String, required: true }, // Storage instructions
  usage: { type: String, required: true }, // How to use the product
  availableIn: { type: String, required: true }, // E.g., "Packs of 5"
  description: { type: String, required: true }, // Full description
  benefits: [
    {
      type: String,
    },
  ],
  sideEffects: [
    {
      type: String,
    },
  ],
  safetyAdvice: {
    alcohol: { type: String, required: true }, // Example: "Unsafe with alcohol"
    pregnancy: { type: String, required: true }, // Example: "Safe if prescribed"
    breastfeeding: { type: String, required: true }, // Example: "Safe if prescribed, but may cause mild effects in baby"
    kidneyLiverIssues: { type: String, required: true }, // Example: "Use with caution. Consult your doctor"
  }, // Safety advice can vary and may need to be an object
  howToUse: { type: String, required: true }, // Instructions on how to use
});

const Product = mongoose.model("Products", productSchema, "Products");

module.exports = Product;
