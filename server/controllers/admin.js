import User from '../models/user.js';
import AI from '../models/ai.js';
import jwt from 'jsonwebtoken';
import Usage from '../models/usage.js';
import { env } from 'process';  
import dotenv from 'dotenv';
dotenv.config();

//get all users from database

const getUsers = async (req, res, next) => {
    const userId = req.userId;
    try {

        /*
        -----------------
        Uses pagination to get users
        for infinite scroll
        -----------------
        */

        //get skip from query, if not present, set to 0
        const skip = req.query.skip && /^\d+$/.test(req.query.skip) ? Number(req.query.skip) : 0;

        const user = await User.findById(userId);
        if (user.admin !== true) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        else {
            const users = await User.find().limit(20).skip(skip);
            return res.status(200).json({ users: users });
        }
    } catch (error) {
        next(error);
    }
};
/*
-----------------
Old email functions,
Uses Plunk to send emails now
due to issues with custom
email server
-----------------
const sendEmail = async (req, res, next) => {
    try {
        for (let i = 0; i < req.body.users.length; i++) {
            const user = await User.findOne({ email: req.body.users[i] });
            if (user) {
                // send email
                await transport.sendMail({
                    from: env.MAIL_SENDER,
                    to: user.email,
                    subject: req.body.subject,
                    html: customEmailTemplate(req.body.content)
                });
            }
        }
        return res.status(200).json({ message: 'Email sent' });
    }
    catch (error) {
        next(error);
    }
}

const sendAllEmail = async (req, res, next) => {
    try {
        const users = await User.find();
        for (let i = 0; i < users.length; i++) {
           if (!users[i].unsubscribed) {
                // send email
                await transport.sendMail({
                    from: env.MAIL_SENDER,
                    to: users[i].email,
                    subject: req.body.subject,
                    html: customEmailTemplate(req.body.content, users[i].email, users[i].name)
                });
                }
            }

        return res.status(200).json({ message: 'Email sent to all users' });
    }
    catch (error) {
        next(error);
    }
}
*/


const getUserCount = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId);
        if (user.admin !== true) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        else {
            const userCount = await User.countDocuments();
            return res.status(200).json({ count: userCount });
        }
    }
    catch (error) {
        next(error);
    }
}

const deleteUser = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.params.userEmail });
        if (user) {
            await user.remove();
            res.status(200).json({ message: 'User deleted' });
        }
    }
    catch (error) {
        next(error);
    }
};

const impersonateUser = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.params.userEmail });
        const adminUser = await User.findById(req.userId);
        if (adminUser.admin !== true) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        else {
            if (user) {
                
                user.impersonated = true;
                await user.save();

                const token = jwt.sign(
                    { userId: user._id.toString() },
                    env.JWT_KEY
                  );
            
                  const maxAge = 1800000; // 30 minutes
                  res.cookie("token", token, {
                    httpOnly: true,
                    maxAge: maxAge,
                    domain: env.DOMAIN || "localhost",
                  });
            
                  res.status(201).json({ message: "User impersonated", impersonatedUser: true });
            }
            else {
                res.status(404).json({ message: 'User not found' });
            }
        }
    }
    catch (error) {
        next(error);
    }
}

const stopImpersonatingUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId);
        const adminUser = await User.findOne({ email: env.ADMIN_EMAIL });

        if (user.impersonated === true) {
        user.impersonated = false;
        await user.save();

        const token = jwt.sign(
            { userId: adminUser._id.toString() },
            env.JWT_KEY
          );

        const maxAge = 2592000000; // 30 days
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: maxAge,
            domain: env.DOMAIN || "localhost",
        });

        res.status(200).json({ message: 'User stopped impersonating' });
    }
    else {
        res.status(401).json({ message: 'User is not impersonated' });
    }
    }
    catch (error) {
        next(error);    
    }
}

const getImpersonatedUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId);
        if (user.impersonated === true) {
            res.status(200).json({ message: 'User is impersonated', impersonatedUser: true });
        }
        else {
            res.status(200).json({ message: 'User is not impersonated', impersonatedUser: false });
        }
    }
    catch (error) {
        next(error);    
    }
}

const isAdmin = async (req, res, next) => {
    const userId = req.userId;
    try {
        const user = await User.findById(userId);
        if (user.admin !== true) {
            return res.status(401).json({ message: 'Unauthorized', isAdmin: false });
        }
        else {
            return res.status(200).json({ message: 'Authorized', isAdmin: true });
        }
    }
    catch (error) {
        next(error);
    }
}

const getAdminStats = async (req, res, next) => {
    try {
        res.status(200).json({ message: 'Admin stats' });
    }
    catch (error) {
        next(error);
    }
}

const resetUserUsage = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId);
        if (user.admin !== true) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        else {
            const usage = await Usage.findOne({ creator: req.params.userId });
            if (usage && usage.AiCredits > 0) {
                usage.AiCredits = 0;
                await usage.save();
                res.status(200).json({ message: 'User usage reset' });
            }
            else {
                res.status(404).json({ message: 'User usage not found' });
            }
        }
    }
    catch (error) {
        next(error);
    }
}

export {
    getUsers,
    deleteUser,
    isAdmin,
    impersonateUser,
    stopImpersonatingUser,
    getImpersonatedUser,
    getUserCount,
    getAdminStats,
    resetUserUsage
};