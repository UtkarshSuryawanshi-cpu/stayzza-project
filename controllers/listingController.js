const Listing = require("../models/listing.js");


module.exports.index = async (req,res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
};

module.exports.newListingForm =  async (req,res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async(req, res, next) => {
    let {id} = req.params;
    let indList = await Listing.findById(id).populate("owner").populate({path: "reviews", populate:{
        path:"author"
    }});

    if(!indList){
        req.flash("error", "Listing does not exists!");
        res.redirect("/listings");
    }

    // console.log(indList);
    res.render("listings/view.ejs", {indList});

};

module.exports.createListing = async (req,res,next) => {
    // console.log(req.file)
    let url = req.file.path;
    let filename = req.file.filename;
    let {title, description, image, price, country, location} = req.body;

    const newListing = new Listing({
        title: title,
        description: description,
        image: image,
        price: price,
        location: location,
        country: country
    })

    if(!newListing.title){
        throw new myError(404,"Title not found!" )
    }
    if(!newListing.description){
        throw new myError(404,"Description not found!" )
    }
    if(!newListing.price){
        throw new myError(404,"Price not Entered!" )
    }
    if(!newListing.location){
        throw new myError(404,"Location not found!" )
    }
    if(!newListing.country){
        throw new myError(404,"Country not found!" )
    }

    newListing.owner = req.user._id;

    newListing.image = {url, filename};

    await newListing.save();

    req.flash("success", "New Listing Created!");
    
    res.redirect("/listings");
    
}

module.exports.editListingForm = async (req,res) => {
    let{id} = req.params;
    let indList = await Listing.findById(id);
    
    if(!indList){
        req.flash("error", "Listing does not exists!");
        res.redirect("/listings");
    }

    res.render("listings/edit.ejs", {indList});
};

module.exports.updateListing = async(req,res) => {
    let {id} = req.params;
    let { title: newTitle, description: newDescription, image: newImage, price:newPrice, country: newcountry, location:newLocaton} = req.body;
        
        
    // if(!Listing.newTitle){
    //     throw new myError(404,"Required Path is Missing" )
    // }
    // if(!Listing.newDescription){
    //     throw new myError(404,"Required Path is Missing" )
    // }
    // if(!Listing.newPrice){
    //     throw new myError(404,"Required Path is Missing" )
    // }
    // if(!Listing.newLocation){
    //     throw new myError(404,"Required Path is Missing" )
    // }
    // if(!Listing.newCountry){
    //     throw new myError(404,"Required Path is Missing" )
    // }

    // let indList = await Listing.findById(id);
    
    // if(! indList.owner._id.equals(res.locals.currentUser._id)){
    //     req.flash("error", "Dont have access to Edit")
    //     return res.redirect(`/listings/${id}`);
    // }
    


    let indList = await Listing.findByIdAndUpdate(id, { title: newTitle, description: newDescription, image: newImage, price:newPrice, country: newcountry, location:newLocaton});

    if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    indList.image = {url, filename};
    }
    await indList.save();
    
    
    req.flash("success", "Listing Edited!");

    
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async(req, res) => {
    let {id} = req.params;

    
    // let indList = await Listing.findById(id);
    
    // if(! indList.owner._id.equals(res.locals.currentUser._id)){
    //     req.flash("error", "Dont have access to Delete")
    //     return res.redirect(`/listings/${id}`);
    // }

    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");

    res.redirect("/listings");
}