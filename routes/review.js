const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middeware.js")
const reviewControllers = require("../controllers/reviews.js");


//Review
// Reviews Route

router.post("/", isLoggedIn, validateReview, wrapAsync(reviewControllers.createReview));

//review delete route
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewControllers.deleteReview));


module.exports = router;