module.exports.isLoggedIn = (req,res,next)=>{
        if(req.isAuthenticated()){

            next();
        }
        else
        {
            req.session.redirectUrl = req.originalUrl;

            req.flash("error", "you must log in first");
            res.redirect("/login")


        }
}


module.exports.saveRedirectUrl = (req,res, next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}



const Listing = require("./models/listing.js")


module.exports.isOwner = async (req,res,next)=>{
    let{id} = req.params;
    
    let indList = await Listing.findById(id);
    
    if(! indList.owner._id.equals(res.locals.currentUser._id)){
        req.flash("error", "Dont have access")
        return res.redirect(`/listings/${id}`);
    }
    next();
}

const Review = require("./models/review.js")



module.exports.isAuthor = async (req,res,next)=>{
    let{id, reviewId} = req.params;
    
    let review = await Review.findById(reviewId);
    
    if(!review.author.equals(res.locals.currentUser._id)){
        req.flash("error", "Dont have access to delete")
        return res.redirect(`/listings/${id}`);
    }
    next();
}