const review=require("../models/review.js");
const listings=require("../models/listing.js");

module.exports.createreview=async (req, res) => {
    const { id } = req.params;
    console.log(listings.findById(id));
    let list = await listings.findById(id);
    let newReview = new review(req.body.review);
    newReview.author = req.user._id; 
    list.reviews.push(newReview);
    await newReview.save();
    await list.save();
    req.flash("success","New Review Created"); 
    res.redirect(`/listings/${id}`);  // Fixed the template literal syntax
}

module.exports.deletereview=async(req,res)=>{
    console.log("hello");
    let{id,review_id}=req.params;
    let rev=review.findById(review_id).populate("author");
    console.log(rev);
    console.log(req.params);
    await listings.findByIdAndUpdate(id, { $pull: { reviews: review_id } });
    await review.findByIdAndDelete(review_id);
    req.flash("success"," Review deleted"); 
    res.redirect(`/listings/${id}`);
}