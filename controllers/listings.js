require("dotenv").config();
const Listing = require("../models/listing.js");
const uploadOnCloudinary = require("../utils/cloudinary.js")
const {listingSchema} = require("../schema.js")

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
}

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
}

module.exports.showListings =  async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate({
        path:"reviews",
        populate : {
            path : "author"
        },
    }).populate("owner");
    if(!listing){
        req.flash("error","Listing not found");
        return res.redirect("/listings");
    }
//    console.log(listing);
    res.render("listings/show", { listing });
}

module.exports.createListing = async (req, res,next) => {
    try {
        let cloudImage = null;
        
        if (req.file) {
            cloudImage = await uploadOnCloudinary(req.file.path);
            
        }

        const newListing = new Listing({
            ...req.body.listing,
            owner: req.user._id,
            image:{
                filename: cloudImage?.public_id || "",
                url: cloudImage?.secure_url || ""
            }
            
        });

        await newListing.save();

        req.flash("success", "Listing created!");
        res.redirect("/listings");

    } catch (err) {
        console.log(err);
        req.flash("error", "Something went wrong");
        res.redirect("/listings");
    }
};
        // let newListing = new Listing(req.body.listing);
        // newListing.owner = req.user._id;
        // await newListing.save();  
        // req.flash("success","Successfully created a new listing");
        // res.redirect("/listings");

module.exports.renderEditForm =  async (req,res)=>{
    const {id} = req.params;
    let listing =  await Listing.findById(id);
    if(!listing){
  
        req.flash("error","Listing not found");
     return res.redirect("/listings");  
    }
    res.render("listings/edit",{ listing });
}

module.exports.updateListing = async (req, res) => {
    const { id } = req.params;

    
    let listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }

    
    listing.title = req.body.listing.title;
    listing.description = req.body.listing.description;
    listing.price = req.body.listing.price;
    listing.location = req.body.listing.location;
    listing.country = req.body.listing.country;

    
    if (req.file) {
        const cloudImage = await uploadOnCloudinary(req.file.path);
        listing.image = {
            filename: cloudImage.public_id,
            url: cloudImage.secure_url,
        };
    }

    
    await listing.save();

    req.flash("success", "Successfully updated the listing");
    res.redirect(`/listings/${id}`);
};


module.exports.deleteListing = async (req,res)=>{
    const {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Successfully deleted the listing");
    res.redirect("/listings");    
}