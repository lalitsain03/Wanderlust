const Listing = require("../models/listing");
const axios = require('axios');

module.exports.index = async (req, res) => {
    const allListings = await Listing.find();
    res.render("listings/index.ejs", { allListings });
}

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
}

module.exports.createListing = async (req, res, next) => {

    let url = req.file.path;
    let filename = req.file.filename;
    let { title, description, price, location, country, category } = req.body;

    // Default geometry in case geocoding fails (Delhi)
    let geometry = {
        type: 'Point',
        coordinates: [77.2167, 28.6448]
    };

    // Call OpenStreetMap Nominatim API to get real coordinates
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: {
            q: location,
            format: 'json',
            limit: 1
        },
        headers: {
            'User-Agent': 'YourAppName/1.0 (youremail@example.com)'
        }
    });

    if (response.data && response.data.length > 0) {
        const lng = parseFloat(response.data[0].lon);
        const lat = parseFloat(response.data[0].lat);
        geometry.coordinates = [lng, lat];
    }

    // Create listing with coordinates
    let listing = new Listing({
        title: title,
        description: description,
        image: {
            filename: filename,
            url: url,
        },
        category: category,
        price: Number(price),
        location: location,
        country: country,
        geometry: geometry,
        owner: req.user._id
    });

    await listing.save();
    req.flash("success", "New listing created successfully");
    res.redirect("/listing");
};


module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner");
    console.log(listing);
    if (!listing) {
        req.flash("error", "listing doesn't exist");
        return res.redirect("/listing");
    }
    res.render("listings/show.ejs", { listing });
}

module.exports.editListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "listing doesn't exist");
        return res.redirect("/listing");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_300,w_250");
    res.render("listings/edit.ejs", { listing, originalImageUrl });

}

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    const { title, description, price, location, country } = req.body;

    const updatedData = {
        title,
        description,
        price,
        location,
        country,
    };

    if (req.file) {
        updatedData.image = {
            url: req.file.path,
            filename: req.file.filename
        };
    }

    // Call Nominatim to get coordinates
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: {
            q: location,
            format: 'json',
            limit: 1
        },
        headers: {
            'User-Agent': 'WanderlustApp/1.0 (https://wanderlust-mfh4.onrender.com; sainlaliy9680@gmail.com)'
        }
    });

    let geometry = {
        type: 'Point',
        coordinates: [77.2167, 28.6448] // default to Delhi
    };

    if (response.data && response.data.length > 0) {
        const lng = parseFloat(response.data[0].lon);
        const lat = parseFloat(response.data[0].lat);
        geometry.coordinates = [lng, lat];
    }

    updatedData.geometry = geometry;

    await Listing.updateOne({ _id: id }, updatedData);

    req.flash("success", "Listing updated!");
    res.redirect(`/listing/${id}`);
};


module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findOneAndDelete({ _id: id });
    req.flash("success", "listing deleted successfully");
    res.redirect("/listing");
}