const listings=require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const maptoken=process.env.MAP_TOKEN_API;
const geocodingClient = mbxGeocoding({ accessToken: maptoken });


module.exports.index=async(req,res)=>{
    const alllistings=await listings.find();
    res.render("listings/index.ejs", { alllistings });
}

module.exports.renderNewform=(req,res)=>{   
    res.render("listings/new.ejs");
}

module.exports.showListing=async (req,res)=>{
    let {id}=req.params;
    let listing=await listings.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
console.log("Listing details:", listing);
await listing.reviews.forEach(review => {
    console.log("Review author details:", review.author.username);});
    if(!listing){
        req.flash("error"," Listing You requested does not exist!!");
        res.redirect("/listings") 
    }
    console.log(listing);
    res.render("listings/show.ejs",{listing});
}

module.exports.postlisting=async (req,res)=>{
    let response=await geocodingClient.forwardGeocode({
        query: req.body.location,
        limit: 1
      })
        .send()
        
    const url=req.file.path;
    const filename=req.file.filename;
    const newlisting=new listings(req.body);
    newlisting.owner=req.user._id;
    newlisting.image={url,filename};
    newlisting.geometry=response.body.features[0].geometry;
    let list=await newlisting.save();
    console.log(list);
    req.flash("success","New Listing created"); 
    res.redirect("/listings");
 
 }

 module.exports.editform= async(req,res)=>{
    let {id}=req.params;
    let list=await listings.findById(id).populate("reviews");
    if(!list){
        req.flash("error"," Listing You requested does not exist!!");
        res.redirect("/listings") 
    }
    let originalimageurl=list.image.url;
    originalimageurl=originalimageurl.replace("/upload","/upload/h_300,w_250");
    console.log(list);
    res.render("listings/edit.ejs",{list,originalimageurl});
}

module.exports.updatelisting =async(req,res)=>{
    let {id}=req.params;
    let {title,description,price,country,location,image}=req.body;
    let list=await listings.findByIdAndUpdate(id,{title:title,description:description,price:price,country:country,location:location},{runValidators:true,new:true});
    if(typeof req.file !=="undefined"){
    const url=req.file.path;
    const filename=req.file.filename;
    list.image={url,filename};
    await list.save();
    }
    req.flash("success"," Listing Updated"); 
    res.redirect(`/listings/${id}`);
}

module.exports.destroylisting=async(req,res)=>{
    let {id}=req.params;  
    await listings.findByIdAndDelete(id);
    req.flash("success"," Listing deleted"); 
    res.redirect(`/listings/`);

}