import express from 'express';
import bcrypt from 'bcrypt';
import path from 'path';
import User from '../back-end/User.js';
import { redirectIfAuthenticated } from '../middleware/auth.js';

const router = express.Router();

// ------------------------------------------------- REGISTER ROUTES ------------------------------------------------------

router.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/front-end/register-screen/register.html'));
});

router.post('/register', async (req, res) => {
    const {username, email, password} = req.body

    try{
        //Check if user already exists
        const existingUser = await User.findOne({ email })
        if(existingUser){
            return res.send("User already exists!");
        }

        //Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        //Save new user to DB
        const newUser = new User({
            username,
            email,
            password:hashedPassword
        });

        await newUser.save();
        res.redirect("/login")
    } catch (error) {
        console.error(error);
        res.send("error registering user")
    } 
})

// ------------------------------------------------- LOGIN ROUTES ------------------------------------------------------
router.get('/login', redirectIfAuthenticated, (req, res) => {
    res.render('login_screen', { error: null });
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.render('login_screen', { error: "Invalid email or password" });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.render('login_screen', { error: "Invalid email or password" });

        req.session.userId = user._id;
        res.redirect('/dashboard');
    } catch (err) {
        console.error(err);
        res.render('login_screen', { error: "Something went wrong" });
    }
});

// ------------------------------------------------- LOGOUT ROUTES ------------------------------------------------------
router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) return res.send("Error logging out");
        res.redirect('/login');
    });
});

export default router;