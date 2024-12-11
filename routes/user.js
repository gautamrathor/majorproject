const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");


const userController = require("../controllers/users.js");
// use router.route to combine common path
router.route("/signup")
.get( userController.renderSignUpForm)
.post( wrapAsync(userController.signUp));


// router.get("/signup", userController.renderSignUpForm);
//     (req, res) => {
//     res.render("users/signup.ejs");
// });

// router.post("/signup", wrapAsync(userController.signUp));
//     async(req, res) => {
//     try{
//         let { username, email, password } = req.body;
//         const newUser = new User({ email, username });
//          const registeredUser = await User.register(newUser, password);
//          req.login(registeredUser, (err) => {
//             if(err) {
//                 return next(err);
//             }
//             req.flash("success", "welcome to wanderlust!");
//             res.redirect("/listings");
//          })
//         } catch(e){
//             req.flash("error", e.message);
//             res.redirect("/signup");
//         }
//    })
//   );


// router.route for login path
router.route("/login")
.get( (userController.renderLoginForm))
.post(
    saveRedirectUrl, 
    passport.authenticate("local",
        {
            failureRedirect: "/login",
            failureFlash: true,
        }
    ),
    userController.login
);
// router.get("/login", (userController.renderLoginForm));
    // ( req, res) => {
//     res.render("users/login.ejs");
// });

// router.post("/login",
//     saveRedirectUrl, 
//     passport.authenticate("local",
//         {
//             failureRedirect: "/login",
//             failureFlash: true,
//         }
//     ),
//     userController.login
    // async (req, res) => {
    //     req.flash("success", "welcome back to wanderlust!");
    //     // res.redirect("/listings");
    //     let redirectUrl = res.locals.redirectUrl || "/listings";
    //     res.redirect(redirectUrl);
    // }
//  );

// to log out
router.get("/logout",(userController.logout));
    //  (req, res, next) => {
    // req.logout((err) => {
    //     if(err) {
    //        return  next(err);
    //     }
    //     req.flash("success","you are logged out!");
    //     res.redirect("/listings");
    // })
// }
// );


module.exports = router;