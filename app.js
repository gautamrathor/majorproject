if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}


// console.log(process.env.SECRET);

const express = require("express");
const app= express();
const mongoose = require("mongoose");
// const Listing = require("./models/listing.js");
const path= require("path");
const  methodOverride = require("method-override");
// ejs mate helps in creatin multiple Template
const ejsMate = require("ejs-mate");
// const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpresssError.js");
// const { listingSchema, reviewSchema } = require("./schema.js");
// const Review = require("./models/review.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

// const listings = require("./routes/listing.js");

// const MONGO_URL = "mongodb://127.0.0.1:27017/wandarlust";
const dbUrl = process.env.ATLASDB_URL;

main() 
.then(() => {
    console.log("connected to db");
})
.catch((err) => {
    console.log(err);
});

async function main() {
    // await mongoose.connect(MONGO_URL);
    await mongoose.connect(dbUrl);
}

app.set("view engine","ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret:process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error", () => {
    console.log("ERROR in MONGO SESSION STORE", err);
});

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7* 24 * 60 * 1000,
        maxAge: 7* 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};

// index route
// app.get("/", (req ,res) => {
//     res.send("HI , I am root");
// });



app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// app.get("/demouser", async (req, res) => {
//     let fakeUser = new User ({
//         email: "student@gmail.com",
//         username: "delta-student"
//     });

//     const registeredUser = await User.register(fakeUser, "helloworld");
//     res.send(registeredUser);
// });

// creating validate function
// const validateListing = (req, res, next) => {
//     let { error } = listingSchema.validate(req.body);
// //    console.log(result);
//    if(error) {
//     let errMsg = error.details.map((el) => el.message).join(",");
//     throw new ExpressError(400, errMsg);
//    } else {
//     next();
//    }
// };

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

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);


// // to print all listing
// app.get("/listings", wrapAsync(async ( req, res) => {
//     // find all list
//    const allListings = await Listing.find({});
//     res.render("listings/index.ejs", { allListings})
// }));

// //new route 
// app.get("/listings/new", (req, res) => {
//     res.render("listings/new.ejs");
// });

// // show route is to perform read operation
// app.get("/listings/:id" , wrapAsync (async (req, res) => {
// let {id} = req.params;
// // find data by id
// const listing = await Listing.findById(id).populate("reviews");
// res.render("listings/show.ejs", {listing});
// }));

// // create route
// app.post("/listings",
//     validateListing,
//     wrapAsync (async (req, res, next) => {
//     // let{ title, description, image, price, country, location } = req.body;
//     // for new created list
//    let result = listingSchema.validate(req.body);
//    console.log(result);
//    if(result.error) {
//     throw new ExpressError(400, result.error);
//    }
//      const newListing = new Listing( req.body.listing );

//      await newListing.save();
//     res.redirect("/listings");
// })
// );



// // edit route
// app.get("/listings/:id/edit",  wrapAsync (async(req, res) => {
// let { id } = req.params;
// const listing = await Listing.findById(id);
// res.render("listings/edit.ejs", { listing });
// }));

// //update route
// app.put("/listings/:id", 
//    validateListing,
//     wrapAsync (async (req, res) => {
//     let { id } = req.params;
//     await Listing.findByIdAndUpdate(id, { ...req.body.listing });
//     res.redirect(`/listings/${id}`);
// }));

// // delete route
// app.delete("/listings/:id", wrapAsync (async(req, res) => {
//     let { id } = req.params;
//     let deletedListing = await Listing.findByIdAndDelete(id);
//     console.log(deletedListing);
//     res.redirect("/listings");
// }));



// //  post review route
// app.post("/listings/:id/reviews", validateReview, wrapAsync(async (req, res) => {
//     let listing = await Listing.findById(req.params.id);
//     let newReview = new Review(req.body.review);

//     listing.reviews.push(newReview);

//     await newReview.save();
//     await listing.save();

//    res.redirect(`/listings/${listing._id}`);
// }));

// // delete review route
// app.delete("/listings/:id/reviews/:reviewId", 
//     wrapAsync(async (req, res) => {
//         let { id , reviewId } = req.params;

//         await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId }});
//         await Review.findByIdAndDelete(reviewId);

//         res.redirect('/listings/${id}');
//     })
// );

// app.get("/testListing" , async (req, res) => {
//     let sampleListing = new Listing({
//         title:"My new villa",
//         description:"By the beach",
//         price: 1200,
//         location: "calungute,Goa",
//         country:"India",
//     });
//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("succesful testing");
// });

app.all("*", (req, res,next) => {
    next(new ExpressError(404, "page not found!"));
});

// middleware
app.use((err, req , res, next) => {
  let { statusCode=500, message="something went wrong!"} = err;
  res.status(statusCode).render("error.ejs", { message });
//   res.status(statusCode).send(message);
});

app.listen(8080, () => {
    console.log("server is listining to port 8080");
});