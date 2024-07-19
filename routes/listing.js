const express=require("express");
const router=express.Router();
const listings=require("../models/listing.js");
const wrapAscync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema}=require("../schema.js");
const passport = require("passport");
const LocalStrategy=require("passport-local");
const {isLoggedIn, listingOwner}=require("../middleware.js");
const {storage}=require("../cloudConfig.js");
const multer  = require('multer')
const upload = multer({storage });

// const validateListing=(req,res,next)=>{
//     let {err}=listingSchema.validate(req.body);
//     if(err){
//         let errMsg=err.details.map((el)=> el.message).join(",");
//         throw new ExpressError(400,errMsg);
//     }
//     else{
//         next();
//     }
// };
const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body); // Destructure and use 'error' instead of 'err'
    if (error) {
        const errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

const listingcontroller=require("../controllers/listing.js");


// index route

router.route("/")
.get(wrapAscync(listingcontroller.index ))
.post(isLoggedIn,upload.single('image'),wrapAscync( listingcontroller.postlisting));


// router.get("/",wrapAscync(listingcontroller.index ));


//new Route
router.get("/new",isLoggedIn,(listingcontroller.renderNewform));


//show route
router.route("/:id")
.get(wrapAscync( listingcontroller.showListing))
.put(isLoggedIn,listingOwner,upload.single('image'),wrapAscync(listingcontroller.updatelisting))
.delete(isLoggedIn,listingOwner,wrapAscync( listingcontroller.destroylisting));


// router.get("/:id",wrapAscync( listingcontroller.showListing));




// router.post("/",isLoggedIn,wrapAscync( listingcontroller.postlisting));


//edit route
router.get("/:id/edit",isLoggedIn,listingOwner,wrapAscync(listingcontroller.editform));



// router.put("/:id",isLoggedIn,listingOwner,wrapAscync(listingcontroller.updatelisting));


// router.delete("/:id",isLoggedIn,listingOwner,wrapAscync( listingcontroller.destroylisting));

module.exports=router;