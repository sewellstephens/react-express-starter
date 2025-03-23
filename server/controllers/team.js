import transport from "../emails/transport.js";
import User from "../models/user.js";
import Payment from "../models/payment.js";
import Team from "../models/team.js";
import { env } from 'process';  
import dotenv from 'dotenv';
import { load } from 'cheerio';
dotenv.config();

import {
    teamInviteTemplate
} from "../emails/templates.js";


/*
-----------------
Usage
-----------------
*/

const basicTeamSize = 1;
const startupTeamSize = 3;
const proTeamSize = 5;

/*
-----------------
Get Pages
-----------------
*/

/*
-----------------
Invite team members
-----------------
*/

const Invite = async (req, res, next) => {
      const userId = req.userId;
      const user = await User.findById(userId);
    try {

        for (let i = 0; i < req.body.emails.length; i++) {

            const user2 = await User.findOne({ email: req.body.emails[i] });
            const payment2 = await Payment.findOne({ email: user.email });
            const teamCount = await User.countDocuments({ team: user.team });

            if (payment2.plan === "Startup") {
                if (teamCount >= startupTeamSize) {
                    return res.status(403).json({ message: "User has reached the limit of team members for the Startup plan.", errCode: 403 });
                }
            }
            else if (payment2.plan === "Pro") {
                if (teamCount >= proTeamSize) {
                    return res.status(403).json({ message: "User has reached the limit of team members for the Pro plan.", errCode: 403 });
                }
            }
            else if (user.admin) {
                console.log("Admin");
            }
            else {
                return res.status(403).json({ message: "User has reached the limit of team members for the Basic plan.", errCode: 403 });
            }

            const options = {
                method: 'POST',
                headers: {'Content-Type': 'application/json', Authorization: `Bearer ${env.PLUNK_API_KEY}`},
                body: JSON.stringify({
                  to: req.body.emails[i],
                  subject: "Team invite",
                  body: teamInviteTemplate(req.body.inviteToken, req.body.teamName, user.email),
                }),
              };
              
              fetch('https://api.useplunk.com/v1/send', options)
                .then(response => response.json())
                .then(response => console.log(response))
                .catch(err => console.error(err));

        }
        return res.status(200).json({ message: "Invites sent!" });

    } catch (err) {
        next(err);
    }
}

/*
-----------------
Accept Invite
-----------------
*/

const AcceptInvite = async (req, res, next) => {
    try {

        const user = await User.findById(req.userId);
        user.team = req.query.team;
        user.org = req.query.org;

        const payment = await Payment.findOne({ email: req.query.invitedBy });

        const payment2 = await Payment.findOne({ email: user.email });

        if (req.query.invitedBy === user.email) {
            return res.status(422).json({ message: "You can't invite yourself." });
        }
        
        payment2.teamUpgrade = true;
        payment2.plan = payment.plan;
        await payment2.save();

        await user.save();
        res.status(302).redirect(env.FRONTEND_URL + "/");
    } catch (err) {
        next(err);
    }
}

/*
-----------------
Get Team
-----------------
*/

const GetTeam = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId);
        const team = user.team;
        const org = user.org;
        const name = user.name;
        const email = user.email;
        if (team) {
            res.status(200).json({ team: team, name: name, email: email, org: org });
        }
        else {
            res.status(404).json({ team: null });
        }
    }
    catch (err) {
        next(err);
    }
}

/*
-----------------
Get Users
-----------------
*/

const GetUsers = async (req, res, next) => {
    try {
        //get skip from query, if not present, set to 0
        const skip = req.query.skip && /^\d+$/.test(req.query.skip) ? Number(req.query.skip) : 0;
        const user = await User.find({ team: req.params.team }).limit(20).skip(skip);
        res.status(200).json({ message: "Users fetched", users: user });
    }
    catch (err) {
        next(err);
    }
}

/*
-----------------
Create Team
-----------------
*/

const createTeam = async (req, res, next) => {
    try {

        if (req.body.website) {
            if (req.body.website.includes('http://')) {
                return res.status(400).json({ message: "Website URL must include https://", errCode: 400 });
            }
    
        
            console.log('content', content);
        }

        const user = await User.findById(req.userId);
        user.team = req.body.teamId;
        user.org = req.body.orgName;
        user.website = req.body.website;
        const team = new Team({
            Requester: req.userId,
        });
        await team.save();
        await user.save();
        res.status(200).json({ message: "Team created!" });
    }
    catch (err) {
        next(err);
    }
}

/*
-----------------
Welcome endpoint,
used when a user signs up
-----------------
contact support@anchorpenewersoft.com
for more information
-----------------
*/

const welcome = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId);
        user.teamSize = req.body.size;
        user.role = req.body.role;
        user.source = req.body.source;
        await user.save();
        res.status(200).json({ message: "Welcome!" });
    }
    catch (err) {
        next(err);
    }
}

/*
-----------------
Change Doc Visibility
-----------------
*/

/*
-----------------
Delete Team Member
-----------------
*/

const deleteTeamMember = async (req, res, next) => {
    try {
        const user = await User.findOne({ email : req.params.user });
        const payment = await Payment.findOne({ email: user.email });

        if (payment.teamUpgrade) {
            payment.plan = "Basic";
            await payment.save();

            user.team = null;
            user.org = null;
            payment.teamUpgrade = false;
            await user.save();
            await payment.save();
            res.status(200).json({ message: "User removed from team!" });
        }
        else {
            user.team = null;
            user.org = null;
            await user.save();
            res.status(200).json({ message: "User removed from team!" });
        }
    }
    catch (err) {
        next(err);
    }
}

/*
-----------------
Exporting the functions
-----------------
*/

export {
    Invite,
    AcceptInvite,
    GetTeam,
    createTeam,
    GetUsers,
    welcome,
    deleteTeamMember,
};