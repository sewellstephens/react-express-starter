import { validationResult } from "express-validator";
import { randomBytes } from "crypto";
import { promisify } from "util";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { google } from 'googleapis';
import { env } from 'process';  
import dotenv from 'dotenv';
import { load } from 'cheerio';
dotenv.config();

import User from "../models/user.js";
import Payment from "../models/payment.js";


import {
  resetPasswordTemplate,
  emailConfirmationTemplate
} from "../emails/templates.js";

/*
-----------------
The following endpoints does not handle JSON requests
meaning that the data is sent as form data
via the action attribute of the form
-----------------
- /users/signup -
- /users/login --
-----------------
Due to the fact that the data is sent as form data,
all responses are redirected to the frontend,
and the responses are all 302 status codes.
Please keep this in mind when working with this endpoint.
-----------------
*/

/*
-----------------
Signup the user
-----------------
Seperate endpoint for Google OAuth
at bottom of file
-----------------
*/

const signup = async (req, res, next) => {
  try {

    /*
    -----------------
    Due to this endpoint not handling JSON requests,
    the req.body is not a JSON object and must be 
    accessed in the way shown below
    -----------------
    const { email, password, name } = req.body;
    -----------------
    */

    const { email, password, name } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errArray = errors.array();
      /*
      -----------------
      Redirecting to the signup page with error message,
      see top of file for more information about the 302 status code
      -----------------
      */
      res.status(302).redirect(`${env.FRONTEND_URL}/signup?error=${errArray[0].msg}`);
    }

    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      /*
      -----------------
      Redirecting to the signup page with error message,
      see top of file for more information about the 302 status code
      -----------------
      */
      res.status(302).redirect(`${env.FRONTEND_URL}/signup?error=Email%20already%20exists`);
    }


    /*
    -----------------
    Hashing the password
    -----------------
    */

    const hashedPassword = await bcrypt.hash(password, Math.floor(Math.random() * 10) + 1);
    const activationToken = (await promisify(randomBytes)(20)).toString("hex");

    const user = new User({
      email: email,
      password: hashedPassword,
      name: name,
      activationToken: activationToken,
    });
    const savedUser = await user.save();

    const payment = new Payment({
      plan: "Basic",
      email: user.email,
    });
    await payment.save();

    const options = {
      method: 'POST',
      headers: {'Content-Type': 'application/json', Authorization: `Bearer ${env.PLUNK_API_KEY}`},
      body: JSON.stringify({
        to: savedUser.email,
        subject: "Confirm Your Email Address",
        body: emailConfirmationTemplate(savedUser.activationToken),
      }),
    };

    /*
    -----------------
    Sending the email
    confirmation, uses
    Plunk API
    -----------------
    */

    fetch('https://api.useplunk.com/v1/send', options)
      .then(response => response.json())
      .then(response => console.log(response))
      .catch(err => console.error(err));

      

    //send welcome email
    await fetch('https://api.useplunk.com/v1/track', {
      method: "POST",
      headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${env.PLUNK_API_KEY}`
      },
      body: JSON.stringify({
          event: 'signup',
          email: savedUser.email,
          subscribed: true,
          data: {
            "name": savedUser.name,
            "email": savedUser.email,
            "activationToken": savedUser.activationToken,
          }
      })
    });

    /*
    -----------------
    Redirecting to the dashboard,
    see top of file for more information about the 302 status code
    -----------------
    */

    res.status(302).redirect(`${env.FRONTEND_URL}/signup?success=true&message=Please%20check%20your%20email%20for%20confirmation`);
  } catch (err) {
    next(err);
  }
};

/*
-----------------
Activate two factor authentication
-----------------
Applies only to non-Google OAuth users
-----------------
*/

const activateTwoFactor = async (req, res, next) => {
  const userId = req.userId;
  const enabledState = req.body.enabledState;

  try {
    const user = await User.findById(userId);

    /*
    -----------------
    Validating the input
    -----------------
    */

    if (!userId || !user) {
      const err = new Error("User is not authenticated.");
      err.statusCode = 401;
      throw err;
    }

    /*
    -----------------
    Updating the user's two factor authentication state
    -----------------
    */

    user.twoFactorEnabled = enabledState;
    const savedUser = await user.save();

    res.status(201).json({
      message: "Two-factor authentication successfully activated.",
      userId: savedUser._id.toString(),
    });

  } catch (err) {
    next(err);
  }
};

/*
-----------------
Login the user
-----------------
Seperate endpoint for Google OAuth
at bottom of file
-----------------
*/

const login = async (req, res, next) => {
  try {

    /*
    -----------------
    Due to this endpoint not handling JSON requests,
    the req.body is not a JSON object and must be 
    accessed in the way shown below
    -----------------
    const { email, password } = req.body;
    -----------------
    */

    const { email, password } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      /*
      -----------------
      Redirecting to the login page with error message,
      see top of file for more information about the 302 status code
      -----------------
      */
      res.status(302).redirect(`${env.FRONTEND_URL}/login?error=Input%20validation%20failed`);
    }

    const user = await User.findOne({ email: email });
    if (!user) {
      /*
      -----------------
      Redirecting to the login page with error message,
      see top of file for more information about the 302 status code
      -----------------
      */
      res.status(302).redirect(`${env.FRONTEND_URL}/login?error=Email%20not%20found`);
    }

    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      /*
      -----------------
      Redirecting to the login page with error message,
      see top of file for more information about the 302 status code
      -----------------
      */
      res.status(302).redirect(`${env.FRONTEND_URL}/login?error=Password%20is%20incorrect`);
    }

    if (!user.twoFactorEnabled) {
      const token = jwt.sign(
        { userId: user._id.toString() },
        env.JWT_KEY
      );
  
      // Set cookie in the browser to store authentication state
      const maxAge = 2592000000; // 30 days
      res.cookie("token", token, {
        httpOnly: true,
        maxAge: maxAge,
        domain: env.DOMAIN || "localhost",
      });

      /*
      -----------------
      Redirecting to the dashboard,
      see top of file for more information about the 302 status code
      -----------------
      */
  
      res.status(302).redirect(`${env.FRONTEND_URL}/`);
    }

    /*
    -----------------
    Sending the two factor authentication email
    when two factor authentication is enabled
    -----------------
    */

    else {
      const activationToken = (await promisify(randomBytes)(20)).toString("hex");
      user.activationToken = activationToken;
      const savedUser = await user.save();

      /*
      -----------------
      Sending the two factor authentication email
      -----------------
      */

      const options = {
        method: 'POST',
        headers: {'Content-Type': 'application/json', Authorization: `Bearer ${env.PLUNK_API_KEY}`},
        body: JSON.stringify({
          to: email,
          subject: "Confirm Your Two-Factor Authentication",
          body: emailConfirmationTemplate(savedUser.activationToken),
        }),
      };
      
      fetch('https://api.useplunk.com/v1/send', options)
        .then(response => response.json())
        .then(response => console.log(response))
        .catch(err => console.error(err));

      /*
      -----------------
      Redirecting to the login page with a message,
      see top of file for more information about the 302 status code
      -----------------
      */

      res.status(302).redirect(`${env.FRONTEND_URL}/login?tfa=true`);
    }
  } catch (err) {
    next(err);
  }
};

/*
-----------------
Logout the user
-----------------
*/

const logout = (req, res, next) => {
  const userId = req.userId;

  /*
  -----------------
  Validating the user
  -----------------
  */

  if (!userId) {
    const err = new Error("User is not authenticated.");
    err.statusCode = 401;
    throw err;
  }

  /*
  -----------------
  Clearing the token cookie
  -----------------
  */

  res.clearCookie("token", { domain: env.DOMAIN || "localhost" });

  /*
  -----------------
  Sending the response
  -----------------
  */

  res.status(200).json({
    message: "User successfully logged out.",
    userId: userId,
  });
};

/*
-----------------
Get the user
-----------------
*/

const getUser = async (req, res, next) => {
  const userId = req.userId;

  /*
  -----------------
  Validating the user
  -----------------
  */

  try {
    const user = await User.findById(userId);

    if (!userId || !user) {
      const err = new Error("User is not authenticated.");
      err.statusCode = 401;
      throw err;
    }

    /*
    -----------------
    Sending the response
    -----------------
    Response is sent in JSON format
    and contains the users information
    as well as their admin status
    -----------------
    */

    res.status(200).json({
      message: "User successfully fetched.",
      userId: user._id.toString(),
      email: user.email,
      name: user.name,
      pages: user.pages,
      isAdmin: user.admin,
      org: user.org,
      website: user.website,
      pictureUrl: user.pictureUrl,
      impersonated: user.impersonated,
    });
  } catch (err) {
    next(err);
  }
};

/*
-----------------
Update the user
-----------------
*/

const updateUser = async (req, res, next) => {
  const userId = req.userId;
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const org = req.body.org;
  const website = req.body.website;
  const pictureUrl = req.body.pictureUrl;
  const count = await User.countDocuments({ email: email });

  try {
    const user = await User.findById(userId);

    /*
    -----------------
    Validating the user
    -----------------
    */

    if (!userId || !user) {
      res.status(401).json({
        message: "User is not authenticated.",
        errCode: 401,
      });
    }

    /*
    -----------------
    Updating the user's password
    -----------------
    */

    if (password) {
      const hashedPassword = await bcrypt.hash(password, Math.floor(Math.random() * 10) + 1);
      user.password = hashedPassword;
    }

    /*
    -----------------
    Validating the email
    and checking if the email already exists
    -----------------
    */

    if (email !== user.email && count > 0) {
      res.status(422).json({
        message: "Email address already exists.",
        errCode: 422,
      });
    }

    /*
    -----------------
    Validating the url
    -----------------
    */

    if (website) {
      if (!website.includes("https://") || website.includes("http://")) {
        res.status(422).json({
          message: "Invalid URL. Please use https:// instead.",
          errCode: 422,
        });
      }
   }

    /*
    -----------------
    Updating the user's information
    -----------------
    */

    user.name = name;
    user.email = email;
    user.org = org;
    user.website = website;
    user.pictureUrl = pictureUrl;
    const savedUser = await user.save();

    res.status(201).json({
      message: "User successfully updated.",
      userId: savedUser._id.toString(),
      name: savedUser.name,
      org: savedUser.org,
      website: savedUser.website,
      email: savedUser.email,
      pictureUrl: savedUser.pictureUrl,
    });
  } catch (err) {
    next(err);
  }
};

/*
-----------------
Get the reset token
-----------------
*/

const getResetToken = async (req, res, next) => {
  const email = req.body.email;

  try {
    /*
    -----------------
    Validating the input
    -----------------
    */

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({
        message: "Input validation failed.",
        errCode: 422,
      });
    }

    /*
    -----------------
    Finding the user
    -----------------
    */

    const user = await User.findOne({ email: email });
    if (!user) {
      res.status(404).json({
        message: "An user with this email could not be found.",
        errCode: 404,
      });
    }

    /*
    -----------------
    Generating the reset token
    -----------------
    */

    const resetToken = (await promisify(randomBytes)(20)).toString("hex");
    const resetTokenExpiry = Date.now() + 1000 * 60 * 60; // 1 hour from now
    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    const savedUser = await user.save();

    /*
    -----------------
    Sending the reset token email
    -----------------
    */

    const options = {
      method: 'POST',
      headers: {'Content-Type': 'application/json', Authorization: `Bearer ${env.PLUNK_API_KEY}`},
      body: JSON.stringify({
        to: email,
        subject: "Your Password Reset Token",
        body: resetPasswordTemplate(savedUser.resetToken),
      }),
    };
    
    fetch('https://api.useplunk.com/v1/send', options)
      .then(response => response.json())
      .then(response => console.log(response))
      .catch(err => console.error(err));

    /*
    -----------------
    Sending the response
    -----------------
    */

    res.status(200).json({
      message: "Password Reset successfully requested! Check your inbox.",
    });
  } catch (err) {
    next(err);
  }
};

/*
-----------------
Reset the user's password
-----------------
*/

const resetPassword = async (req, res, next) => {
  const password = req.body.password;
  const resetToken = req.body.resetToken;

  try {
    /*
    -----------------
    Validating the input
    -----------------
    */

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({
        message: "Input validation failed.",
        errCode: 422,
      });
    }

    const user = await User.findOne({
      resetToken: resetToken,
      resetTokenExpiry: { $gt: Date.now() - 2592000000 },
    });
    if (!user) {
      res.status(422).json({
        message: "The token is either invalid or expired.",
        errCode: 422,
      });
    }

    /*
    -----------------
    Hashing the password
    -----------------
    */

    const hashedPassword = await bcrypt.hash(password, Math.floor(Math.random() * 10) + 1);
    user.password = hashedPassword;
    user.resetToken = null;
    user.resetTokenExpiry = null;
    const savedUser = await user.save();

    // Automatically sign in user after password reset
    const token = jwt.sign(
      { userId: savedUser._id.toString() },
      env.JWT_KEY
    );

    const maxAge = 2592000000; // 30 days
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: maxAge,
      domain: env.DOMAIN || "localhost",
    });

    /*
    -----------------
    Sending the response
    -----------------
    */

    res.status(201).json({
      message: "Password successfully changed.",
      token: token,
      userId: savedUser._id.toString(),
    });
  } catch (err) {
    next(err);
  }
};

/*
-----------------
Activate the user's account
Applies only to non-Google OAuth users
and is to prevent spam and fraudulant signups
-----------------
Stripe payments are handled in the payments.js file
and fruad is handled also by byedispute
-----------------
See https://byedispute.com/ for more information
-----------------
*/

const activateAccount = async (req, res, next) => {
  const activationToken = req.params.token;

  try {
    const user = await User.findOne({
      activationToken: activationToken,
    });
    if (!user) {
      const err = new Error("The activation code is invalid.");
      err.statusCode = 422;
      throw err;
    }

    if (!user.active) {
  
      user.active = true;
      user.activationToken = null;
      const savedUser = await user.save();

      const token = jwt.sign(
        { userId: savedUser._id.toString() },
        env.JWT_KEY
      );
  
      // Set cookie in the browser to store authentication state
      const maxAge = 2592000000; // 30 days
      res.cookie("token", token, {
        httpOnly: true,
        maxAge: maxAge,
        domain: env.DOMAIN || "localhost",
      });
  
      res.status(302).redirect(`${env.FRONTEND_URL}/`);
    }
    else {

      user.activationToken = null;
      await user.save();

      const token = jwt.sign(
        { userId: user._id.toString() },
        env.JWT_KEY
      );
  
      // Set cookie in the browser to store authentication state
      const maxAge = 2592000000; // 30 days
      res.cookie("token", token, {
        httpOnly: true,
        maxAge: maxAge,
        domain: env.DOMAIN || "localhost",
      });

      
  
      res.status(302).redirect(`${env.FRONTEND_URL}/`);
    }
  } catch (err) {
    next(err);
  }
};

/*
-----------------
Google OAuth Callback
-----------------
Used to handle the response from Google after successful authentication
-----------------
*/

const googleOAuthCallback = async (req, res, next) => {

  const oauth2Client1 = new google.auth.OAuth2(
    env.GOOGLE_CLIENT_ID,
    env.GOOGLE_CLIENT_SECRET,
    env.GOOGLE_REDIRECT_URI
  );
  const code = req.query.code;
  const {tokens} = await oauth2Client1.getToken(code)
   oauth2Client1.setCredentials(tokens);

   let oauth2 = google.oauth2({
    auth: oauth2Client1,
    version: 'v2'
  });
  let { data } = await oauth2.userinfo.get();

  const email = data.email;
  const name = data.name;
  const picture = data.picture;

 try {
  if (email && name) {
    const user = await User.findOne({ email: email });
    if (user) {
      const token = jwt.sign(
        { userId: user._id.toString() },
        env.JWT_KEY
      );

      const maxAge = 2592000000; // 30 days
      res.cookie("token", token, {
        httpOnly: true,
        maxAge: maxAge,
        domain: env.DOMAIN || "localhost",
      });

      user.pictureUrl = picture;
      await user.save();

      res.status(302).redirect(`${env.FRONTEND_URL}/`);
    } else {

      const payment = new Payment({
        plan: "Basic",
        email: email,
  });
  await payment.save();

      const newUser = new User({
        email: email,
        name: name,
        active: true,
        pictureUrl: picture,
      });
      const savedUser = await newUser.save();

      const token = jwt.sign(
        { userId: savedUser._id.toString() },
        env.JWT_KEY
      );

      const maxAge = 2592000000; // 30 days
      res.cookie("token", token, {
        httpOnly: true,
        maxAge: maxAge,
        domain: env.DOMAIN || "localhost",
      });

      await fetch('https://api.useplunk.com/v1/track', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${env.PLUNK_API_KEY}`
        },
        body: JSON.stringify({
            event: 'signup',
            email: email,
            subscribed: true,
            data: {
              "name": name,
              "email": email,
            }
        })
    });

      res.status(302).redirect(`${env.FRONTEND_URL}/`);
    }
  } else {
    const err = new Error("Google login failed.");
    err.statusCode = 401;
    throw err;
  }
}
catch (err) {
  next(err);
}
};

/*
-----------------
Google OAuth Redirect
-----------------
Used to initiate the Google OAuth flow
-----------------
*/

const googleAuth = async (req, res, next) => {
  try {
    const oauth2Client = new google.auth.OAuth2(
      env.GOOGLE_CLIENT_ID,
      env.GOOGLE_CLIENT_SECRET,
      env.GOOGLE_REDIRECT_URI
    );
    
    // generate a url that asks for consent
    const scopes =['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile', 'openid']
    
    const url = oauth2Client.generateAuthUrl({
      // 'online' (default) or 'offline' (gets refresh_token)
      access_type: 'offline',
    
      // If you only need one scope you can pass it as a string
      scope: scopes
    });
    res.status(302).redirect(url);
  }
  catch (err) {
    next(err);
  }
};

/*
-----------------
Unsubscribe from emails
-----------------
legacy code from before Plunk was used,
see /controllers/admin.js top of file for more information
-----------------
*/

const unsubscribe = async (req, res, next) => {
  const email = req.params.email;
  try {
    const user = await User.findOne({ email: email });
    if (user) {
      user.unsubscribed = true;
      await user.save();
      res.status(200).json({
        message: "User successfully unsubscribed.",
      });
    }
  }
  catch (err) {
    next(err);
  }
}

/*
-----------------
Delete the user
-----------------
Important for 
GDPR compliance
-----------------
*/

const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    user.delete();
    res.status(200).json({
      message: "User successfully deleted.",
    });
  }
  catch (err) {
    next(err);
  }
};

/*
-----------------
Exporting the functions
-----------------
*/

export {
    signup,
    login,
    logout,
    getUser,
    updateUser,
    getResetToken,
    resetPassword,
    activateAccount,
    googleOAuthCallback,
    googleAuth,
    unsubscribe,
    deleteUser,
    activateTwoFactor,
};