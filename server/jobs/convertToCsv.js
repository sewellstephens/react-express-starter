import users from "../models/user.js";
import { env } from 'process';  
import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config();

const convertToCsv = async () => {
    try {
        let csv = "";
        const allUsers = await users.find({});
        for (let i = 0; i < allUsers.length; i++) {
            let email = allUsers[i].email;
            console.log(email);
            console.log(JSON.stringify({
                "email": allUsers[i].email,
                "data": {}
            }));
            

            csv += `${allUsers[i].email},${allUsers[i].name}\n`;

        }
        fs.writeFileSync('users.csv', csv);
        console.log("CSV file created successfully", csv);
    } catch (err) {
        console.log(err);
    }
}

export default convertToCsv;