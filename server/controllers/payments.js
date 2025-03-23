// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
import Stripe from 'stripe';
import Payment from '../models/payment.js';
import User from '../models/user.js';
import { env } from 'process';  
import dotenv from 'dotenv';
dotenv.config();

// The price ID passed from the client
//   const {priceId} = req.body;

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

/*
-----------------
Stripe Payments with fraud protection by byedispute
See https://byedispute.com for more information
-----------------
*/



/*
-----------------
Billing Portal
-----------------
*/


const createBillingPortal = async (req, res, next) => {
    const formData = req.body;
    console.log(formData);
    const { email } = formData;

    try {
        const payment = await Payment.findOne({ email: email });
        const configuration = await stripe.billingPortal.configurations.create({
          business_profile: {
            headline: 'Krastie AI partners with Stripe for simplified billing.',
          },
          features: {
            invoice_history: {
              enabled: true,
            },
            subscription_cancel: {
              enabled: true,
            },
            customer_update: {
              allowed_updates: ['address', 'tax_id'],
              enabled: true,
            },
            payment_method_update: {
              enabled: true,
            }
          },
        });

        const session = await stripe.billingPortal.sessions.create({
            customer: payment.customerId,
            configuration: configuration.id,
            return_url: `${env.FRONTEND_URL}/dashboard`,
        });

        res.status(302).redirect(session.url);
    }
    catch (err) {
        next(err);
    }
};

/*
-----------------
Checkout Session
-----------------
*/

const createCheckoutSession = async (req, res, next) => {


    const { priceId, planName, email, name } = req.body;
    console.log(`priceId: ${priceId}`);
    console.log(`planName: ${planName}`);
    console.log(`email: ${email}`);
    console.log(`name: ${name}`);
    try {

      //check if user exists
      const user = await User.findOne({ email: email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      //check if customer exists
      if (!user.customerId) {
        const customer = await stripe.customers.create({
                email: email,
                name: name,
            });
            user.customerId = customer.id;
            await user.save();
            const payment = await Payment.findOne({ email : customer.email });
            payment.customerId = customer.id;
            payment.teamUpgrade = false;
            await payment.save();
      }

       if (priceId === "basic") {
        res.status(302).redirect(`${env.FRONTEND_URL}/dashboard?success=true`);
       }
       else {
        const session = await stripe.checkout.sessions.create({
            mode: 'subscription',
            allow_promotion_codes: true,
            customer: user.customerId,
            customer_update: {
                address: 'auto',
            },
            metadata: {
                plan: planName,
            },
            line_items: [
                {
                price: priceId,
                quantity: 1,
                },
            ],
            automatic_tax: {
                enabled: true,
              },
            success_url: `${env.FRONTEND_URL}/dashboard?success=true`,
            cancel_url: `${env.FRONTEND_URL}/dashboard?success=false`,
            });
        
            res.status(302).redirect(session.url);
       }
    } catch (err) {
        next(err);
    }
};

/*
-----------------
Webhook to handle Stripe events,
such as subscription updates, cancellations, etc.
-----------------
DO NOT REMOVE OR MODIFY THIS CODE 
UNLESS YOU KNOW WHAT YOU'RE DOING
-----------------
for concerns, contact support@anchorpenewersoft.com
-----------------
*/

const webhook = async (req, res, next) => {

  //verify the signature of the request
  const signature = req.headers['stripe-signature'];
  const endpointSecret = env.STRIPE_WEBHOOK_SECRET;
  let event = stripe.webhooks.constructEvent(req.body, signature, endpointSecret);

  if (!signature || !endpointSecret) {
    return res.status(400).json({ message: 'Invalid request signature' });
  }

  if (event.type === "checkout.session.completed") {

      try {
        const session = event.data.object;
        console.log(session);
        console.log(session.metadata);
        console.log(session.metadata.plan);
        console.log(session.customer_details.email);
        const payment = await Payment.findOne({ customerId: session.customer });
        payment.plan = session.metadata.plan;
        payment.teamUpgrade = false;
        await payment.save();
        res.status(200).json({ received: true });
      } catch (err) {
        res.status(400).json(err);
      }
      
  }
  else if (event.type === "customer.created") {
    try {
      const customer = event.data.object
        const user = await User.findOne({ email: customer.email });
        user.customerId = customer.id;
        await user.save();
        const payment = await Payment.findOne({ email : customer.email });
        payment.customerId = customer.id;
        payment.teamUpgrade = false;
        await payment.save();
        res.status(200).json({ received: true });
    }
catch (err) {
    res.status(400).json(err);
  }
    }
else if (event.type === "customer.subscription.deleted" || event.type === "invoice.payment_failed") {
    try {
        const subscription = event.data.object;
        const payment = await Payment.findOne({ customerId: subscription.customer });
        payment.plan = "Basic";
        payment.teamUpgrade = false;
        await payment.save();
        res.status(200).json({ received: true });
    } catch (err) {
        res.status(400).json(err);
      }
    }
        else if (event.type === "customer.subscription.updated" || event.type === "customer.subscription.created") {
            try {
                const subscription = event.data.object;
                const payment = await Payment.findOne({ customerId: subscription.customer });
                    if (subscription.plan.product === env.STRIPE_PRODUCT_STARTUP) {
                        payment.plan = "Startup";
                        payment.teamUpgrade = false;
                        await payment.save();
                    res.status(200).json({ received: true });
                    }
                    else if (subscription.plan.product === env.STRIPE_PRODUCT_PRO) {
                        payment.plan = "Pro";
                        payment.teamUpgrade = false;
                        await payment.save();
                    res.status(200).json({ received: true });
                    }
            
        } catch (err) {
            res.status(400).json(err);
          }
        }
            else {
                res.status(404).json({ message: "Event not found" });
            }

};


/*
-----------------
Exporting the functions
-----------------
*/

export {
    createCheckoutSession,
    createBillingPortal,
    webhook
};