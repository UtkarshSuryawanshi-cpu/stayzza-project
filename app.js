if(process.env.NODE_ENV != "production"){
    require('dotenv').config()
}
// console.log(process.env.CLOUD_NAME);

// Requiring Express
const express = require("express");
const app = express();

// Requiring Mongoose
const mongoose =require("mongoose");

// // Accessing Listing model from listing.js file
// const Listing = require("./models/listing.js")

// Requiring ejs
const path = require("path");

// requiring method-override
const methodOverride = require("method-override");
app.use(methodOverride("_method"));

// Requiring EJS-Mate
const ejsMate = require("ejs-mate");
app.engine("ejs", ejsMate);

// // Requiring wrapAsync - a unique function
// const wrapAsync = require("./utils/wrapAsync.js");

// Requiring myError
const myError = require("./utils/myError.js");

// Requiring schema joi
// const {listingSchema} = require("./schema.js");

// // Accessing Review Model
// const Review = require("./models/review.js");

// Accesing listings route
const listingRouter = require("./routes/listingRoutes.js");

// Accesing reviews route
const reviewRouter = require("./routes/reviewRoutes.js");

// Requiring Express-session
const session = require("express-session");

// Requiring mongo store
const MongoStore = require("connect-mongo");

// Requiring flash
const flash = require("connect-flash");

// Requiring passport
const passport = require("passport");

// Requiring passport-local strategy
const LocalStrategy = require("passport-local");

// Requiring User Model
const User = require("./models/user.js");

//Accessing User Route
const userRouter = require("./routes/userRoutes.js")

const dbUrl = process.env.ATLASDB_URL;

const store= MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET
    },
    touchAfter: 24*60*60
})
store.on("error", ()=>{
    console.log("ERROR IN MONGO SESSION STORE", err);
})
const sessionOptions = {
    store: store,
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httponly : true
    }
} 

app.set("views", path.join(__dirname, "views"));
app.set("views engine", "ejs");


// parsing data of requests
app.use(express.urlencoded({extended:true}));

// For Using static files
app.use(express.static(path.join(__dirname,"/public")));



// Establishing Connection With Database
async function main(){
    const dbUrl = process.env.ATLASDB_URL;
      await mongoose.connect(dbUrl);
}
main()
.then(()=>{
    console.log("connection succesful");
})
.catch((error)=>{
    console.log(error);
})

const port = process.env.PORT;
// Establishing Connection With Server With The Help Of Port
app.listen(port , ()=>{
    console.log("server is listening to port: 8080");
})


app.use(session(sessionOptions));
app.use(flash());



app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



//res.locals.middleware
app.use((req,res,next)=>{
    res.locals.successMsg = req.flash("success")
    res.locals.errorMsg = req.flash("error");
    res.locals.currentUser = req.user;
    next();
})

// app.get("/demoUser", async (req,res)=>{
//     let newUser = new User({
//         email: "Lauren23@gmail.com",
//         username: "Lauren-student"
//     })

//     let registeredNewUser = await User.register(newUser, "Alpha#6");
//     res.send(registeredNewUser);
// })



//// Listing routes
app.use("/listings", listingRouter);

//// review routes
app.use("/listings/:id/reviews", reviewRouter);

//// user routes
app.use("/", userRouter);



////Error Handling Middleware
app.use((err,req,res,next)=>{
    // res.send("something went wrong");

    // let{status, message} = err;
    
    let{status=500, message="Some Error Occured"} = err;
    // res.status(status).send(message);

    res.render("error.ejs", {status, message});
})




