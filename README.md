# MedFam - React Native Medical App

MedFam is a React Native based medical application designed to simplify medicine ordering, family medicine management, and quick checkout. It integrates with MongoDB, Express, and Razorpay for backend and payments.  

---

## Features  

- **Login & Authentication**: Secure JWT-based login system.  
- **Medicine Management**: Search, browse, and add medicines to cart.  
- **Templates**: Save medicine kits for family members (e.g., *Grandfather’s Medicine Kit*) and reorder with one click.  
- **Cart & Checkout**: Manage cart items, addresses, and place orders seamlessly.  
- **Payment Integration**: Razorpay integration for secure payments.  

---

## Tech Stack  

- **Frontend**: React Native with Expo Router  
- **Backend**: Express + MongoDB + JWT Authentication  
- **Payments**: Razorpay Integration  
- **Storage**: MongoDB for products, templates, users  

---

## 📸 Screenshots  

<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">

  <!-- Login -->
  <div>
    <h4>🔑 Login</h4>
    <img src="https://res.cloudinary.com/dxgs9krt4/image/upload/v1755409921/Login_Page_vnntpn.jpg" width="200"/>
  </div>

  <!-- Home -->
  <div>
    <h4>🏠 Home</h4>
    <img src="https://res.cloudinary.com/dxgs9krt4/image/upload/v1755409921/Home_Page_k5hczq.jpg" width="200"/>
  </div>

  <!-- Products -->
  <div>
    <h4>💊 Products</h4>
    <img src="https://res.cloudinary.com/dxgs9krt4/image/upload/v1755409921/Products_Page_2_sbdwk8.jpg" width="200"/>
    <img src="https://res.cloudinary.com/dxgs9krt4/image/upload/v1755409921/Products_Page_fprqpg.jpg" width="200"/>
  </div>

  <!-- Templates -->
  <div>
    <h4>📋 Templates</h4>
    <img src="https://res.cloudinary.com/dxgs9krt4/image/upload/v1755409921/Template_wyxhcl.jpg" width="200"/>
    <img src="https://res.cloudinary.com/dxgs9krt4/image/upload/v1755409921/Templates_Page_bhgfjx.jpg" width="200"/>
    <img src="https://res.cloudinary.com/dxgs9krt4/image/upload/v1755409921/Remove_Templates_page_wtf8rs.jpg" width="200"/>
  </div>

  <!-- Addresses -->
  <div>
    <h4>🏡 Addresses</h4>
    <img src="https://res.cloudinary.com/dxgs9krt4/image/upload/v1755409921/Addresses_Page_xsfwsb.jpg" width="200"/>
  </div>

  <!-- Cart -->
  <div>
    <h4>🛒 Cart & Checkout</h4>
    <img src="https://res.cloudinary.com/dxgs9krt4/image/upload/v1755409921/Cart_Checkout_sb3awg.jpg" width="200"/>
  </div>

  <!-- Payments -->
  <div>
    <h4>💳 Payments</h4>
    <img src="https://res.cloudinary.com/dxgs9krt4/image/upload/v1755409922/Razorpay_2_yez71a.jpg" width="200"/>
    <img src="https://res.cloudinary.com/dxgs9krt4/image/upload/v1755409922/Razorpay_1_hzrwgs.jpg" width="200"/>
    <img src="https://res.cloudinary.com/dxgs9krt4/image/upload/v1755409921/Payment_Ongoing_rznsxv.jpg" width="200"/>
    <img src="https://res.cloudinary.com/dxgs9krt4/image/upload/v1755409921/Payment_Completed_r56qsg.jpg" width="200"/>
  </div>

</div>

---

## Example Use Case  

- A user can log in and create a medicine template for their **grandfather’s medicine kit**.  
- During the next order, instead of searching again, they can reorder the saved kit directly.  
- This saves time and ensures consistency in repeat orders.  

---

## Installation & Setup  

1. Clone the repository  
   ```bash
   git clone https://github.com/yourusername/medfam.git
   cd medfam
   

2. Install dependencies
   ```bash
   npm install


3. Start the app with Expo
   ```bash
   npx expo start


4. Backend Setup
   ```bash
   Run the Express + MongoDB backend separately

5. Create a .env file and configure it with:
   ```bash
   MongoDB connection string

   Razorpay API keys

## Future Enhancements

- AI-powered medicine recommendations

- Push notifications for refill reminders

- Multi-language support

- Detailed analytics for family medicine tracking
