const express=require("express");
const router=express.Router({ mergeParams: true });
const wrapAscync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const listings=require("../models/listing.js");
const {reviewSchema}=require("../schema.js");
const review=require("../models/review.js");
const user=require("../models/user.js");
const { isLoggedIn,reviewOwner } = require("../middleware.js");
const {saveRedirectUrl}=require("../middleware.js");

const validateReview=(req,res,next)=>{
    let {err}=reviewSchema.validate(req.body);
    if(err){
        let errMsg=err.details.map((el)=> el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
};

const reviewController=require("../controllers/reviews.js");

router.post("/",isLoggedIn,validateReview,saveRedirectUrl,wrapAscync(reviewController.createreview));

router.delete("/:review_id",isLoggedIn,reviewOwner,reviewController.deletereview);

module.exports=router;