const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const User = require("./user.js");
const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        filename: {
            type: String,
            default: "default-image-filename.jpg", // Default filename
        },
        url: {
            type: String,
            default: "https://th.bing.com/th/id/OIP.hDY2jxVhA4c934xmoGxQ5wHaE8?rs=1&pid=ImgDetMain", // Default image URL
        },
    },
    price: Number,
    location: String,
    country: String,
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:"Review",
}],
owner:{
    type:Schema.Types.ObjectId,
    ref:"User"
},

geometry:{
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  }
});



listingSchema.post("findOneAndDelete",async(list)=>{
    if(list){
        await Review.deleteMany({_id:{$in:list.reviews}});
    }
    
})

const listing = mongoose.model("listing", listingSchema);
module.exports = listing; 
