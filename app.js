const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require('path');
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/expressError.js")
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const dotenv = require("dotenv");
const listingRouter = require("./router/listing.js");
const reviewRouter = require("./router/reviews.js");
const userRouter = require("./router/user.js");
require("dotenv").config();

const PORT =  3000;
main().then(() => {
    console.log("database is connected")
})
    .catch((err) => {
        console.log(`connection fail due to ${err}`);
    })

async function main() {
    await mongoose.connect(`${process.env.MONGO_DB_URI}/wanderlust`);
}

const sessionOption = {
    secret: "mysecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000
    }
}

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));





app.get('/', ((req, res) => {
    res.send('root is working');
}))

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

// app.get("/demouser",async (req,res)=>{
//     let fakeUser = new User({
//         email:"abhi@gmail.com",
//         username:"Maurya abhi",
//     });

//     let registeredUser = await User.register(fakeUser,"helloworld");
//     res.send(registeredUser);
// })

app.use("/listings",listingRouter)
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);


app.use((req, res, next) => {
    next(new ExpressError(404, 'Page Not Found'));
});

app.use((err,req,res,next)=>{
    let {status = 500,message = "Somthing went wrong"} = err;
    
    res.status(status).render("error.ejs",{err})
})
app.listen(PORT, () => {
    console.log(`port is running in port ${PORT}`);
})