const express= require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpresssError.js");
const { reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js"); 

// const validateReview = (req, res, next) => {
//     let { error } = reviewSchema.validate(req.body);
// //    console.log(result);
//    if(error) {
//     let errMsg = error.details.map((el) => el.message).join(",");
//     throw new ExpressError(400, errMsg);
//    } else {
//     next();
//    }
// };


const reviewController = require("../controllers/reviews.js");
//  post review route
router.post("/", 
    isLoggedIn,
    validateReview,
     wrapAsync(reviewController.createReview));
//         async (req, res) => {
//     let listing = await Listing.findById(req.params.id);
//     let newReview = new Review(req.body.review);
//     newReview.author = req.user._id;
//     listing.reviews.push(newReview);

//     await newReview.save();
//     await listing.save();
//     req.flash("success", "New Review Created!");

//    res.redirect(`/listings/${listing._id}`);
//  })
// );

// delete review route
router.delete("/:reviewId", 
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(reviewController.deleteReview));
    //     async (req, res) => {
    //     let { id , reviewId } = req.params;

    //     await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId }});
    //     await Review.findByIdAndDelete(reviewId);
    //     req.flash("success", "Review deleted!");

    //     res.redirect('/listings/${id}');
    // })
// );

module.exports = router;