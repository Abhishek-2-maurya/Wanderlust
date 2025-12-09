const asyncWrap = require("../utils/asyncWrap");
const Listing = require('../models/listing');
const { listingSchema } = require("../schema");
const ExpressError = require("../utils/expressError.js")
const express = require("express");
const router = express.Router();
const {isLoggedIn, isOwner,listingValidation} = require("../middleware.js")
const listingControllers = require("../controllers/listings.js");
const upload = require("../utils/multer.js");



router.route('/')
.get(asyncWrap(listingControllers.index))
.post(isLoggedIn,upload.single("listing[image]"),asyncWrap(listingControllers.createListing))




//newRoute
router.get("/new", isLoggedIn,listingControllers.renderNewForm);

router.route("/:id")
.get(asyncWrap(listingControllers.showListings))
.put(isLoggedIn,isOwner,upload.single("listing[image]"),asyncWrap(listingControllers.updateListing))
.delete(isLoggedIn,isOwner,asyncWrap(listingControllers.deleteListing))

//edit route
router.get("/:id/edit",isLoggedIn,isOwner,asyncWrap(listingControllers.renderEditForm));



module.exports = router;