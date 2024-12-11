const express= require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
// const ExpressError = require("../utils/ExpresssError.js");
// const { listingSchema, reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing } = require("../middleware.js");

const listingController = require("../controllers/listings.js");
// use multer for parse the file data
const multer  = require("multer");
const { storage }  = require("../cloudConfig.js");
const upload = multer({ storage });

// to print all listing
// router.get("/", wrapAsync(listingController.index));
//      wrapAsync(async ( req, res) => {
//     // find all list
//    const allListings = await Listing.find({});
//     res.render("listings/index.ejs", { allListings});
// }));

// index route using router.route
router.route("/")
.get( wrapAsync(listingController.index))
.post(
    isLoggedIn,
    // validateListing,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.createListing)
// .post( upload.single('listing[image]'), (req, res) => {
//     res.send(req.file);
// }
);
    //new route 
router.get("/new", isLoggedIn, listingController.renderNewForm);

    // common part /:id using router.route
    router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put( 
        isLoggedIn,
        isOwner,
        upload.single("listing[image]"),
       validateListing,
        wrapAsync (listingController.updateListing))
        .delete( 
            isLoggedIn,
            isOwner,
            wrapAsync (listingController.deleteListing));




//     isLoggedIn, (req, res) => {
//     res.render("listings/new.ejs");
// });

// show route is to perform read operation
// router.get("/:id" ,wrapAsync(listingController.showListing));
//      wrapAsync (async (req, res) => {
//      let {id} = req.params;
//     // find data by id
//    const listing = await Listing.findById(id)
//     .populate({
//      path: "reviews",
//      populate : {
//         path: "author",
//     },
//     })
// .populate("owner");
// if(!listing) {
//     req.flash("error", "Listing you requested for does not exist!");
//     res.redirect("/listings");
// }
// console.log(listing);
// res.render("listings/show.ejs", { listing });
// }));


// create route
// router.post("/",
//     isLoggedIn,
//     validateListing,
//     wrapAsync(listingController.createListing));
//     wrapAsync (async (req, res, next) => {
//     // let{ title, description, image, price, country, location } = req.body;
//     // for new created list
//     // let result = listingSchema.validate(req.body);
//     // console.log(result);
//     // if(result.error) {
//     //  throw new ExpressError(400, result.error);
//     // }
//      const newListing = new Listing( req.body.listing );
//         newListing.owner = req.user._id;
//      await newListing.save();
//      req.flash("success", "New Listing Created!");
//     res.redirect("/listings");
// })
// );

// edit route
router.get("/:id/edit", 
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.renderEditForm));
//      wrapAsync(async(req, res) => {
// let { id } = req.params;
// const listing = await Listing.findById(id);
// if(!listing) {
//     req.flash("error", "Listing you requested for does not exist!");
//     res.redirect("/listings");
// }
// res.render("listings/edit.ejs", { listing });
// })
// );

//update route
// router.put("/:id", 
//     isLoggedIn,
//     isOwner,
//    validateListing,
//     wrapAsync (listingController.updateListing));
//         async (req, res) => {
//     let { id } = req.params;

//     await Listing.findByIdAndUpdate(id, { ...req.body.listing });
//     req.flash("success", " Listing Updated!");
//     res.redirect(`/listings/${id}`);
// }));

// delete route
// router.delete("/:id", 
//     isLoggedIn,
//     isOwner,
//     wrapAsync (listingController.deleteListing));
//         async(req, res) => {
//     let { id } = req.params;
//     let deletedListing = await Listing.findByIdAndDelete(id);
//     console.log(deletedListing);
//     req.flash("success", " Listing deleted!");
//     res.redirect("/listings");
// }));


module.exports = router;