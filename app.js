if (process.env.NODE_ENV != "production") {
    require('dotenv').config()
}
console.log(process.env.SECRET)

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const ExpressError = require("./utils/ExpressError.js")
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js")
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLASDB_URL;

app.engine('ejs', ejsMate);

main().then((res) => {
    console.log("mongoose started");
}).catch((err) => {
    console.log(err);
})
async function main() {
    await mongoose.connect(dbUrl);
}

//setting view engine as ejs file
app.set("view engine", "ejs");

// set the view directory 
app.set("views", path.join(__dirname, "views"))

//parse from data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//serving static files
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));


//store created for connect-mongo
const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
})
store.on("error", () => {
    console.log("ERROR IN MONGO SESSION STORE")
})

//Option for session middleware
const sessionOption = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
}



// app.get("/", (req, res) => {
//     res.send("working");
// });


//session middleware used

app.use(session(sessionOption));
//flash middleware is used
app.use(flash());

//initialize passport
app.use(passport.initialize())
//session for user passport
app.use(passport.session());

//authenticate method to use authentication
passport.use(new LocalStrategy(User.authenticate()));

// to serialize(store user info in session) and deserialize(to remove user info after session completion)
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.success = req.flash("success")
    res.locals.error = req.flash("error")
    res.locals.currUser = req.user;
    next();
})

// app.get("/demoUser",async (req,res) => {
//     let fakeUser = new User({
//         email:"student@gmail.com",
//         username:"lalit sain"
//     })

//     let registeredUser = await User.register(fakeUser,"helloWorld");
//     res.send(registeredUser);
// })

// app.get("/testListing", async (req,res) => {
// let sampleListing = new Listing({
//     title:"My new villa",
//     description:"By the beach",
//     price:1200,
//     location:"Calengat, Goa",
//     country:"India",
// });
// await sampleListing.save().then((res) => {
//     console.log(res);
// }).catch((err)=> {
//     console.log(err);
// });
// res.send("route is working");
// })

//using listing route via router
app.use("/listing", listingRouter);
app.use("/listing/:id/reviews", reviewRouter);
app.use("/", userRouter);

app.all(/.*/, (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
})
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Some Error Occured" } = err;
    res.status(statusCode).render("error.ejs", { message });
    // res.status(statusCode).send(message);
    // res.send("something went wrong");
})
app.listen(8080, () => {
    console.log("app is listening on port 8080");
})
