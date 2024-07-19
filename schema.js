const joi=require('joi');
const listingSchema=joi.object({
    listing:joi.object({
        title:joi.string().required(),
        description:joi.string().required(),
        location:joi.string().required(),
        country:joi.string().required(),
        price:joi.number().required().min(0),
        // image:joi.string().allow("",null),
        // image: joi.object({
        //     filename: joi.string().default('defaultImage'),
        //     url: joi.string().allow("",null).default('https://example.com/defaultImage.jpg')
        //   }).default()
    }).required()
});


const reviewSchema=joi.object({
    review: joi.object({
        rating: joi.number().required(),
        comment: joi.string().required(),
    }).required()
});


module.exports = { listingSchema };
module.exports={reviewSchema};