import Usage from "../models/usage.js";
import Payment from "../models/payment.js";
import User from "../models/user.js";
import { env } from 'process';  
import dotenv from 'dotenv';
import pLimit from 'p-limit';

dotenv.config();

const BATCH_SIZE = 100; // Define a batch size
const limit = pLimit(5); // Limit to 5 concurrent operations

const resetUsage = async () => {
    try {
        const usageRecords = await Usage.find({});
        for (let i = 0; i < usageRecords.length; i += BATCH_SIZE) {
            const batch = usageRecords.slice(i, i + BATCH_SIZE);
            const resetPromises = batch.map((usage) => limit(async () => {
                const user = await User.findById(usage.creator);
                const payment = await Payment.findOne({ userId: user._id });

                let updated = false;
                if (usage.textGenerationCredits > 0) {
                    usage.textGenerationCredits = 0;
                    updated = true;
                }
                if (usage.imageGenerationCredits > 0) {
                    usage.imageGenerationCredits = 0;
                    updated = true;
                }
                if (usage.keywordCredits > 0) {
                    usage.keywordCredits = 0;
                    updated = true;
                }

                if (updated) {
                    await usage.save();
                }
            }));

            await Promise.all(resetPromises);
        }

        const adminAIStats = await adminAIStats.findById('674689d335c7af76af66221b');
        adminAIStats.totalCost = 0;
        adminAIStats.totalRequests = 0;
        adminAIStats.totalTokens = 0;
        adminAIStats.costByModel = {};
        await adminAIStats.save();

        console.log("Usage reset successfully");
    } catch (err) {
        console.error("Error in resetUsage:", err);
    }
}

export default resetUsage;