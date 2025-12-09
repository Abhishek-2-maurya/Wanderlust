const Listing = require("../models/listing");
const Review = require("../models/review");
const ExpressError  = require("../utils/expressError");
module.exports.createReviews = async (req,res) =>{
     const listing = await Listing.findById(req.params.id);
     let newReview = new Review(req.body.review); 
     newReview.author = req.user._id;
     listing.reviews.push(newReview._id);
     await newReview.save();
     await listing.save();
     console.log("reviews saved");
     req.flash("success","Successfully created a new review");
     res.redirect(`/listings/${listing._id}`);
}

module.exports.deleteReview = async(req,res)=>{
    const { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Successfully deleted the review");
    res.redirect(`/listings/${id}`);
}