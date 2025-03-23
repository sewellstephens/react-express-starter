import { env } from 'process';  
import dotenv from 'dotenv';
dotenv.config();



const globalStyle = `
body {
    font-family: sans-serif;
    font-size: 16px;
    line-height: 1.5;
    margin: 0 auto;
    color: #333333;
    background-color: white;
    padding: 20px;
}
.container {
    max-width: 600px;
    margin: 0 auto;
    background-color: white;
    height: 100%;
    padding: 20px;
}
h1 {
    font-size: 24px;
}
a {
    color: #0F2E53;
    text-decoration: none;
    font-weight: bold;
}
a.button {
    display: inline-block;
    margin: 16px 0;
    background-color: #6203fc;
    color: white;
    border-radius: 8px; 
    padding: 6px 12px;
}
`;

const resetPasswordTemplate = (resetToken) => `
    <html>
        <head>
            <title>Reset Your Password</title>
            <style>${globalStyle}</style>
        </head>
        <body>
        <div class="container">
        <div style="display: flex; align-items: center;"><a href="https://example.com"><img src="${env.FRONTEND_URL}/images/logos/re-logo.png" style="width: 150px;"></img></a></div>
        
        <h1>Reset Your Password</h1>
        <p>Hey there!</p>
        <p>You are about to reset your password. Continue to do so by following this link:</p>
        <p><a class="button" href="${env.FRONTEND_URL}/reset?token=${resetToken}" target="_blank">Reset Password</a></p>
        <p>Or paste the url in your browser: ${env.FRONTEND_URL}/reset?token=${resetToken}</p>
        <p>You can ignore if you remembered your password</p>
        </div>
        </body>
    </html>
`;

const emailConfirmationTemplate = (activationToken) => `
    <html>
        <head>
            <title>Confirm Your Email</title>
            <style>${globalStyle}</style>
        </head>
        <body><div class="container">
        <div style="display: flex; align-items: center;"><a href="https://krastie.ai"><img src="${env.FRONTEND_URL}/images/logos/re-logo.png" style="width: 150px;"></img></a></div>
            <h1>Confirm Your Email</h1>
            <p>Welcome to <strong>Express Starter</strong>!</p>
            <p>Let's confirm your email address. Please click the button to confirm your email address:</p>
            <p><a class="button" href="${env.BACKEND_URL}/users/activate/${activationToken}" target="_blank">Confirm Email Address</a></p>
            <p>Or paste the url in your browser: ${env.BACKEND_URL}/users/activate/${activationToken}</p>
            <p>Please confirm within 1 hour</p>
            </div>
        </body>
    </html>
`;

const teamInviteTemplate = (inviteToken, teamName, email) => `
    <html>
        <head>
            <title>Team invite</title>
            <style>${globalStyle}</style>
        </head>
        <body><div class="container">
        <div style="display: flex; align-items: center;"><a href="https://example.com"><img src="${env.FRONTEND_URL}/images/logos/re-logo.png" style="width: 150px;"></img></a></div>
            <h1>Team invite</h1>
            <p>You are invited to ${teamName}</p>
            <p>Let's confirm your invite. Please click the button to confirm your invite and activate your account:</p>
            <p><a class="button" href="${env.BACKEND_URL}/team/teamAccept?team=${inviteToken}&org=${teamName}&invitedBy=${email}" target="_blank">Confirm Invite</a></p>
            <p>Or paste the url in your browser: ${env.BACKEND_URL}/team/teamAccept?team=${inviteToken}&org=${teamName}&invitedBy=${email}</p>
            <p>You can safely ignore if you don't reconise this invite.</p>
            <p style="margin-top: 40px;">
            </div>
        </body>
    </html>
`;

const customEmailTemplate = (content, email, name) => `
    <html>
        <head>
            <title>Email</title>
            <style>${globalStyle}</style>
        </head>
        <body>
        <body><div class="container">
        <div style="display: flex; align-items: center;"><a href="https://krastie.ai"><img src="${env.FRONTEND_URL}/images/logos/re-logo.png" style="width: 150px;"></img></a></div>
            <p>Hey ${name}!</p>
            ${content}
            <a href="${env.BACKEND_URL}/users/unsubscribe/${email}">Unsubscribe</a>
            <p style="margin-top: 40px;">
                Sewell Stephens 👋<br/>
                <a href="https://krastie.ai" target="_blank">Krastie AI</a>
            </p>
            </div>
        </body>
        </body>
    </html>
`;

export {
    resetPasswordTemplate,
    emailConfirmationTemplate,
    teamInviteTemplate,
    customEmailTemplate,
};