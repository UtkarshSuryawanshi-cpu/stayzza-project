
const express = require("express");
const router = express.Router();             //creating router object


// Accessing Listing model from listing.js file
const Listing = require("../models/listing.js")

// Requiring wrapAsync - a unique function
const wrapAsync = require("../utils/wrapAsync.js");

// Requiring myError
const myError = require("../utils/myError.js");

const { isLoggedIn } = require("../middleware.js")
const { isOwner } = require("../middleware.js")

const listingController = require("../controllers/listingController.js");


const multer = require("multer");
const { storage } = require("../cloudConfig.js")
const upload = multer({ storage });


//// Validate listingSchema
// const validateListing= (req,res,next)=>{
//   let {error} =listingSchema.validate(req.body);
//     // console.log(result);
//     if(error){
//         next( new myError(400,error));
//     }
//     else{
//         next();
//     }
// }

// // Root Route
// router.get("/", (req,res)=>{
//     res.send("Hi! i am root");
// })



// router.route("/")
// .get("/",  wrapAsync(listingController.index))
// .post("/",  wrapAsync(listingController.createListing));


// router.route("/:id")
// .get("/:id", wrapAsync(listingController.showListing))
// .put("/:id", isOwner, wrapAsync());





//index route
router.get("/",  wrapAsync(listingController.index));


// new route
router.get("/new", isLoggedIn, listingController.newListingForm);


// show route
router.get("/:id", wrapAsync(listingController.showListing));


// create route/ post route
router.post("/",  isLoggedIn, upload.single('image'), wrapAsync(listingController.createListing))




// edit route
router.get("/:id/edit", isLoggedIn, isOwner , wrapAsync(listingController.editListingForm));


// update route
router.put("/:id", isOwner, upload.single('image'), wrapAsync(listingController.updateListing))



// delete route
router.delete("/:id/delete",isOwner,isLoggedIn, wrapAsync(listingController.destroyListing));




module.exports = router;