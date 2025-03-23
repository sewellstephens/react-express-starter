/*
-----------------
This file was originally intended 
to handle all AI related functions,
but is currently in pages folder.
-----------------
Feel free to change things around, 
but make sure to update the routes in routes/ai.js
and the urls in the frontend.
-----------------
if issue persists, 
contact support@anchorpenewersoft.com
-----------------
*/

import Usage from "../models/usage.js";
import Payment from "../models/payment.js";
import User from "../models/user.js";
import { env } from 'process';  
import dotenv from 'dotenv';
dotenv.config();


/*
-----------------
Get AI usage
-----------------
*/

/*
-----------------
Usage variables moved up here for convienence 
and to make it easy to change values
-----------------
*/

const getAiUsage = async (req, res, next) => {
    const userId = req.userId;

    /*
    -----------------
    Log the user id for debugging
    -----------------
    */

    console.log(userId);
    
    try {
        const usage = await Usage.findOne({ creator: userId });
        const user = await User.findById(userId);
        const payment = await Payment.findOne({ email: user.email });
        const teamCount = await User.countDocuments({ team: user.team });

        if (!usage) {
            const usage1 = new Usage({
                creator: userId,
                textGenerationCredits: 0,
                imageGenerationCredits: 0,
                keywordCredits: 0
            });
            await usage1.save();
        }

        /*
        -----------------
        Check the plan and return the usage
        -----------------
        If the user is an admin, return ∞,
        otherwise return the usage based on the plan
        and can be changed as needed.
        -----------------
        */

        if (payment.plan === "Startup") {
            res.status(200).json({ 
                textGenerationCredits: `${usage.textGenerationCredits}/300`,
                imageGenerationCredits: `${usage.imageGenerationCredits}/100`,
                keywordCredits: `${usage.keywordCredits}/30`,
                teamSize: `${teamCount}/3`
            });
        }
        else if (payment.plan === "Pro") {
            res.status(200).json({ 
                textGenerationCredits: `${usage.textGenerationCredits}/500`,
                imageGenerationCredits: `${usage.imageGenerationCredits}/300`,
                keywordCredits: `${usage.keywordCredits}/50`,
                teamSize: `${teamCount}/5`
            });
        }
        else if (user.admin === true) {
            res.status(200).json({ 
                textGenerationCredits: `${usage.textGenerationCredits}/∞`,
                imageGenerationCredits: `${usage.imageGenerationCredits}/∞`,
                keywordCredits: `${usage.keywordCredits}/∞`,
                teamSize: `${teamCount}/∞`
            });
        }
        else {
            res.status(200).json({ 
                textGenerationCredits: `${usage.textGenerationCredits}/20`,
                imageGenerationCredits: `${usage.imageGenerationCredits}/10`,
                keywordCredits: `${usage.keywordCredits}/5`,
                teamSize: `${teamCount}/1`
            });
        }
    }
    catch (err) {
        next(err);
    }
};

const getPlan = async (req, res, next) => {
    const userId = req.userId;
    const user = await User.findById(userId);
    const payment = await Payment.findOne({ email: user.email });

    if (user.admin === true) {
        res.status(200).json({ plan: "Pro", teamUpgrade: false });
    }
    else {
        res.status(200).json({ plan: payment.plan, teamUpgrade: payment.teamUpgrade });
    }
};

/*
-----------------
Exporting the functions
-----------------
*/

export {
    getAiUsage,
    getPlan
};