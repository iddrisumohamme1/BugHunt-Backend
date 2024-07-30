const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const Bug = require('./models/bug.models.js');
const User = require('./models/user.models.js');
const flash = require('connect-flash');

const app = express();



// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Use EJS as the view engine
app.set("view engine", "ejs");

// Static files
app.use(express.static("public"));

// Session handling
app.use(session({
    secret: 'your-secret-key', // Replace with your own secret
    resave: false,
    saveUninitialized: true,
}));


// Flash messages
app.use(flash());


// Routes to render pages
app.get("/register", (req, res) => {
    res.render("register");
});

app.get('/login', (req, res) => {
    res.render('login', { alert: null });
});


app.get("/dashboard", (req, res) => {
    const alert = req.session.alert;
    req.session.alert = null; // Clear the alert after use
    res.render('dashboard', { alert });
    console.log('Alert in dashboard route:', alert);

});

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
        }
        res.redirect('/login');
    });
});


// API routes
const bugRouter = require('./routes/bug.route.js');
app.use('/api/bugs', bugRouter);

const userRouter = require('./routes/user.route.js'); 
app.use('/api/users', userRouter);

// Database connection
mongoose.connect("mongodb+srv://iddrisumohamme1:ZcBkWy7IjDar5s8L@bughuntdb.gruv4iz.mongodb.net/BugHuntDB?retryWrites=true&w=majority&appName=BugHuntDB")
.then(() => {
    console.log("Connected to the database");
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
})
.catch((error) => {
    console.error("Connection failed:", error);
});
