if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require('express');
const mongoose = require('mongoose');
const Bug = require('./models/bug.models.js');
const User = require('./models/user.models.js');
const cors = require('cors');
const session = require('express-session');

const app = express();



app.use(session({
  secret: 'your secret key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // set to true if using https
}));




// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}))


// API routes
const bugRouter = require('./routes/bug.route.js');
app.use('/api/bugs', bugRouter);

const userRouter = require('./routes/user.route.js'); 
app.use('/api/users', userRouter);

// Database connection
////*mongoose.connect("mongodb+srv://iddrisumohamme1:ZcBkWy7IjDar5s8L@bughuntdb.gruv4iz.mongodb.net/BugHuntDB?retryWrites=true&w=majority&appName=BugHuntDB")*/
mongoose.connect(process.env.DATABASES_URL)
.then(() => {
    console.log("Connected to the database");
    app.listen(process.env.PORT || 5000, () => {
        console.log(`Server is running on port ${process.env.PORT || 5000}`);
    });
})
.catch((error) => {
    console.error("Connection failed:", error);
});