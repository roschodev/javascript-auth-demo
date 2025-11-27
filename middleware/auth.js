import User from '../back-end/User.js';

export async function authMiddleware(req, res, next) {
    if (!req.session.userId) {
        return res.redirect('/login');
    }

    try {
        const user = await User.findById(req.session.userId);
        if (!user) {
            return res.redirect('/login');
        }

        req.user = user; // attach user to request object
        next();
    } catch (err) {
        console.error(err);
        return res.send("Error fetching user");
    }
}

export async function redirectIfAuthenticated(req, res, next) {
    if (req.session.userId) return res.redirect('/dashboard');
    next();
}