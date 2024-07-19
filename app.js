if(process.env.NODE_ENV !="production")
require('dotenv').config();
console.log(process.env.SECRET);
const express=require("express");
const app=express();
const port=8080;
const mongoose=require("mongoose");
const MONGO_URL="mongodb://127.0.0.1:27017/insecure";
const mongoatlasurl=process.env.ATLASDB_URL;
const listings=require("./models/listing.js");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require('ejs-mate');
const wrapAscync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema, reviewSchema}=require("./schema.js");
const review=require("./models/review.js");
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash =require("connect-flash");

const listingRoute=require("./routes/listing.js");
const ReviewRoute=require("./routes/review.js");
const UserRoute=require("./routes/user.js");
const passport = require("passport");
const LocalStrategy=require("passport-local");
const user=require("./models/user.js");

app.use(methodOverride('_method'));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const store = MongoStore.create({
    mongoUrl: mongoatlasurl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error", (err) => {
    console.log("error in mongo session store", err);
});
const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave: false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now()+1000*60*60*24*3,
        maxAge:1000*60*60*24*3,
        httpOnly:true
    },
}


main()
.then(()=>{
    console.log("connected to DB");
})
.catch((err)=>{
    console.log(err);
});


async function main(){
    await mongoose.connect(mongoatlasurl);
}
// async function main() {
//     try {
//         await mongoose.connect(mongoatlasurl, {
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//             serverSelectionTimeoutMS: 30000, // 30 seconds
//             socketTimeoutMS: 45000, // 45 seconds
//             ssl: true
//         });
//         console.log("Connected to DB");
//     } catch (err) {
//         console.error("Error connecting to MongoDB:", err);
//     }
// }



app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

// Configure Passport to use 'email' instead of 'username'
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, user.authenticate()));

passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());
app.use((req,res,next)=>{
    console.log("Current User:", req.user);
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
});


// app.get("/",(req,res)=>{
//     res.render("listings/home.ejs");
// });





// app.get("/registerUser",async(req,res)=>{
//     let fakeUser=new user({
//         email:"student@gmail.com",
//         username:"student",
//     });
//     let newUser=await user.register(fakeUser,"helloworld");
//     res.send(newUser);
// });

app.use("/listings",listingRoute);
app.use("/listings/:id/reviews",ReviewRoute);
app.use("/users",UserRoute);



app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not Found!!"));
})


app.use((err,req,res,next)=>{
    let{status=500,message="Something went worng"}=err;
    res.status(status).render("listings/error.ejs",{message});    
})

app.listen(port,()=>{
    console.log("listening to port 8080");
});





