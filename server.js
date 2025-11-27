import express from 'express';
import session from 'express-session';
import { rateLimit } from 'express-rate-limit'
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import 'dotenv/config';


import authRoutes from './routes/auth.js';
import dashboardRoutes from './routes/dashboard.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


//Initializing Express App
const app = express();

//Templating
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//Serve static files from front-end folder
app.use(express.static(path.join(__dirname, "public")));

//Middleware
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: process.env.NODE_ENV === 'production', 
        httpOnly: true, 
        sameSite: 'lax' 
    }
}))

app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
}));

//DATABASE
mongoose.connect(`mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.ypgvgkt.mongodb.net/`)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error(err));


//ROUTES
app.use('/', authRoutes);
app.use('/dashboard', dashboardRoutes);

//ROOT
app.get('/', (req, res) => {
    if (req.session.userId) {
        res.redirect('/dashboard');
    } else {
        res.redirect('/login');
    }
});

//START SERVER
app.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});