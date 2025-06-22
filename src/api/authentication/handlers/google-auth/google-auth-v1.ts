import express, { Request, Response, NextFunction } from "express";
import passport from "passport";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import { createUser } from "../../services/database/user";
import { UserRole } from "@prisma/client";
import { logger } from "../../../../utils/logger";
import { HttpStatusCode } from "../../../../exceptions";



passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            callbackURL: process.env.GOOGLE_CALLBACK_URL!,
        },
        async (accessToken: any, refreshToken: any, profile: Profile, done: any) => {
            try {
                logger.info("Google OAuth callback triggered", { email: profile.emails?.[0]?.value });
                // Upsert user using Google profile
                const email = profile.emails?.[0]?.value;
                if (!email) {
                    logger.error("No email found in Google profile", { profile });
                    return done(new Error("No email found in Google profile"));
                }
                const user = await createUser({
                    firstName: profile.name?.givenName || "",
                    middleName: "",
                    lastName: profile.name?.familyName || "",
                    email,
                    password: "", // No password for Google users
                    role: UserRole.CLIENT,
                    // Add any other fields as needed
                });
                logger.info("User created or found via Google OAuth", { email });
                return done(null, user);
            } catch (err) {
                logger.error("Google OAuth error:", err);
                return done(err);
            }
        }
    )
);

passport.serializeUser((user: any, done) => {
    logger.info("Serializing user for session", { userId: user?.id });
    done(null, user);
});
passport.deserializeUser((user: any, done) => {
    logger.info("Deserializing user from session", { userId: user?.id });
    done(null, user);
});

export const initiateGoogleLogin = passport.authenticate('google', {
    scope: ['profile', 'email'],
});

export const handleGoogleCallback = [
    passport.authenticate('google', { failureRedirect: 'http://localhost:3000/api/:version/auth/google/error' }),
    (req: Request, res: Response) => {
        logger.info("Google OAuth callback successful, redirecting to /google/success", { userId: (req.user as any)?.id });
        res.redirect('http://localhost:3000/api/:version/auth/google/success');
    },
];


export const googleLoginSuccess = (req: Request, res: Response) => {
    if (!req.user) {
        logger.warn("Google login success endpoint hit but no user found in session");
        return res.status(HttpStatusCode.UNAUTHORIZED).json({ message: "Not authenticated" });
    }
    const { password, ...userWithoutPassword } = req.user as any;
    logger.info("Google login successful", { userId: userWithoutPassword?.id });
    res.status(HttpStatusCode.OK).json({ user: userWithoutPassword });
};

export const googleLoginError = (req: Request, res: Response) => {
    logger.error("Error logging in via Google");
    res.send('Error logging in via Google..');
};

export const googleLogout = (req: Request, res: Response) => {
    try {
        if (req.session) {
            req.session.destroy((err) => {
                if (err) {
                    logger.error("Error destroying session during Google logout", { error: err });
                    return res.status(500).send({ message: 'Failed to destroy session' });
                } else {
                    logger.info("Session destroyed during Google logout");
                    // Send a JSON response or redirect instead of rendering a view
                    return res.status(200).json({ message: "Logged out successfully" });
                    // Or: return res.redirect('/'); // Redirect to home or login page
                }
            });
        } else {
            logger.warn("No session found during Google logout");
            return res.status(200).json({ message: "No session found, but logged out" });
        }
    } catch (err: any) {
        logger.error("Failed to sign out user via Google", { error: err?.message || err });
        res.status(400).send({ message: 'Failed to sign out user' });
    }
};