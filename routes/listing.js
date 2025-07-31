const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middeware.js")
const listingController = require("../controllers/listing.js");
const multer = require('multer')
const { storage } = require("../cloudConfig.js")
const upload = multer({ storage });

//new form route
router.get("/new", isLoggedIn, listingController.renderNewForm);

//router.route(path)
router.route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn, upload.single('image'), validateListing, wrapAsync(listingController.createListing));

router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn, isOwner, upload.single('image'), validateListing, wrapAsync(listingController.updateListing))
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));


//index route
// router.get("/", wrapAsync(listingController.index));

//new form route
router.get("/new", isLoggedIn, listingController.renderNewForm);

//post new route
// router.post("/", isLoggedIn, validateListing, wrapAsync(listingController.createListing));

//show route
// router.get("/:id", wrapAsync(listingController.showListing));

//edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.editListing));

//update route
// router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(listingController.updateListing));

//delete route 
// router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));

module.exports = router;