const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const axios = require("axios");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const categories = [
  "Trending", "Rooms", "Iconic cities", "Mountains", "Castles",
  "Amazing pool", "Camping", "Farming", "Arctics", "Domes", "Boats"
];

const initDB = async () => {
  await Listing.deleteMany({});
  console.log("Old listings deleted");

  const listingsWithGeo = [];

  for (let idx = 0; idx < initData.data.length; idx++) {
    let obj = initData.data[idx];
    let coordinates = [77.2167, 28.6448]; // Default: Delhi

    try {
      const response = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: {
          q: obj.location,
          format: 'json',
          limit: 1
        },
        headers: {
          'User-Agent': 'wanderlust-app/1.0 (youremail@example.com)'
        }
      });

      if (response.data && response.data.length > 0) {
        const lng = parseFloat(response.data[0].lon);
        const lat = parseFloat(response.data[0].lat);
        coordinates = [lng, lat];
      } else {
        console.log(`No geocode found for: ${obj.location}, using default`);
      }
    } catch (error) {
      console.error(`Error geocoding location "${obj.location}":`, error.message);
    }

    listingsWithGeo.push({
      ...obj,
      owner: "688060c1fe5e35c9f0b64808",
      geometry: {
        type: "Point",
        coordinates: coordinates
      },
      // Add a category for each listing, cycling through categories
      category: categories[idx % categories.length]
    });

    // wait 1 second before next request (to avoid rate limit)
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  await Listing.insertMany(listingsWithGeo);
  console.log("Data was initialized with real coordinates and categories!");
};

initDB();
