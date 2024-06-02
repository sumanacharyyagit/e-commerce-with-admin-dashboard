// C:\Program Files (x86)\stripe_1.19.5_windows_x86_64>stripe login
// Your pairing code is: proud-favour-smart-glow
// This pairing code verifies your authentication with Stripe.
// Press Enter to open the browser or visit https://dashboard.stripe.com/stripecli/confirm_auth?t=enQgPE0PpMwYqRSBOPybUqIYij9fg7HN (^C to quit)^C
// C:\Program Files (x86)\stripe_1.19.5_windows_x86_64>

import db from "@/db/db";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

const resend = new Resend(process.env.RESEND_API_KEY as string);

export async function POST(req: NextRequest) {
    console.log("Hitted");

    const event = await stripe.webhooks.constructEvent(
        await req.text(),
        req.headers.get("stripe-signature") as string,
        process.env.STRIPE_WEB_HOOK_SIGNING_SECRET as string
    );
    if (event.type === "charge.succeeded") {
        const charge = event.data.object;
        const productId = charge.metadata.productId;
        const email = charge.billing_details.email;
        const pricePaidInCents = charge.amount;

        const product = await db.product.findUnique({
            where: { id: productId },
        });

        if (!product || !email)
            return new NextResponse("Invalid credentials!", {
                status: 400,
            });

        const userDataFields = {
            email,
            orders: { create: { productId, pricePaidInCents } },
        };

        const {
            orders: [order],
        } = await db.user.upsert({
            where: { email },
            create: userDataFields,
            update: userDataFields,
            select: { orders: { orderBy: { createdAt: "desc" }, take: 1 } },
        });

        const downloadVerification = await db.downloadVerification.create({
            data: {
                productId,
                expires: new Date(Date.now() * 1000 * 60 * 60 * 24),
            },
        });

        console.log(downloadVerification, "downloadVerification");

        resend.emails.send({
            from: `Support <${process.env.SENDER_EMAIL}>`,
            to: email,
            subject: "Order Confirmation!",
            react: <h1>Hi</h1>,
        });

        console.log("Email sent");

        return new NextResponse();
    }
}
