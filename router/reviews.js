const asyncWrap = require("../utils/asyncWrap");
const {validationReview, isLoggedIn, isReviewAuthor} = require("../middleware.js")
const express = require("express");
const router = express.Router({ mergeParams: true });
const reviewControllers = require("../controllers/review.js");

//Reviwes
router.post("/",isLoggedIn,validationReview,asyncWrap(reviewControllers.createReviews))

//Delete Reviwes

router.delete("/:reviewId",isLoggedIn,isReviewAuthor,asyncWrap(reviewControllers.deleteReview))

module.exports = router;