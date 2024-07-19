
const review=require("./models/review.js");
const listings=require("./models/listing.js");
const user=require("./models/user.js");


module.exports.isLoggedIn=(req,res,next)=>{
if(!req.isAuthenticated()){
    req.session.redirectUrl=req.originalUrl;
    req.flash("error","You must be logged in to create listing");
    return res.redirect("/users/login");
}
next();
};

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

module.exports.listingOwner=async(req,res,next)=>{
    const { id } = req.params;
    let list=await listings.findById(id);
    if(!list.owner._id.equals(req.user._id)){
        req.flash("error","Your don't have permission to modify this listing ");
         return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.reviewOwner=async(req,res,next)=>{
    let{id,review_id}=req.params;
    let rev=await review.findById(review_id).populate("author");
    
    if(!rev.author._id.equals(req.user._id)){
        req.flash("error","you are not author of that review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

