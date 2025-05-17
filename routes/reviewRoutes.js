const express = require("express");
const router = express.Router({mergeParams: true});             //creating router object

// Accessing Review Model
const Review = require("../models/review.js");

// Requiring wrapAsync - a unique function
const wrapAsync = require("../utils/wrapAsync.js");

// Requiring myError
const myError = require("../utils/myError.js");

// Accessing Listing model from listing.js file     for reviews adds inn listings, so listing schema required
const Listing = require("../models/listing.js")

const { isLoggedIn, isAuthor } = require("../middleware.js")

const reviewController = require("../controllers/reviewController.js");


//// reviews submission
router.post("/", isLoggedIn, wrapAsync(reviewController.createReview));


//// review deletion
router.delete("/:reviewId",isLoggedIn,isAuthor,  wrapAsync (reviewController.destroyReview));



module.exports = router;