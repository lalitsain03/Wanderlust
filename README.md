# 🌍 Wanderlust

Wanderlust is a **full-stack web application** inspired by Airbnb — built using the **MERN stack** (MongoDB, Express.js, Node.js) along with **EJS**, **Bootstrap**, and **Leaflet.js** for interactive maps.  
It lets users explore unique stays, add new listings, view them on the map, and leave reviews.

> 🚀 [Live Demo](https://wanderlust-mfh4.onrender.com/listing) | 📦 [GitHub Repo](https://github.com/lalitsain03/Wanderlust)

---

## ✨ **Features**

✅ Create, edit & delete property listings  
✅ Category-based filtering (e.g., Trending, Camping, Domes, Arctic, etc.)  
✅ Upload property images  
✅ Interactive maps with **OpenStreetMap & Nominatim API** geocoding  
✅ User authentication & session management  
✅ Ratings & reviews for listings  
✅ Responsive UI with Bootstrap

---

## 🛠 **Tech Stack**

- **Backend:** Node.js, Express.js
- **Frontend:** EJS, HTML, CSS, Bootstrap
- **Database:** MongoDB (Atlas)
- **Maps & Geocoding:** Leaflet.js, OpenStreetMap, Nominatim API
- **Authentication:** Passport.js
- **Other:** Cloudinary (image uploads), dotenv, method-override, connect-flash

---

## 🚀 **Installation & Setup**

```bash
# Clone this repository
git clone https://github.com/lalitsain03/Wanderlust.git

# Navigate to project folder
cd Wanderlust

# Install dependencies
npm install

# Set environment variables (create .env file)
# Example:
# CLOUDINARY_CLOUD_NAME=your_cloud_name
# CLOUDINARY_KEY=your_key
# CLOUDINARY_SECRET=your_secret
# ATLASDB_URL=your_mongodb_atlas_connection_string
# SECRET=your_session_secret

# Run locally
node app.js
