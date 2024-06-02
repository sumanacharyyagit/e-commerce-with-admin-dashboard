import db from "@/db/db";
import { notFound } from "next/navigation";
import Stripe from "stripe";
import CheckoutForm from "./_components/CheckoutForm";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

const PurchasePage = async ({ params: { id } }: { params: { id: string } }) => {
    const product = await db.product.findUnique({ where: { id } });
    if (!product) return notFound();

    const paymentIntent = await stripe.paymentIntents.create({
        amount: product.priceInCents,
        currency: "USD",
        metadata: {
            productId: product.id,
        },
        description: "Test Payments for ECommerceWebApp",
    });

    if (!paymentIntent.client_secret)
        throw Error("Stripe failed to create new payment intent");

    return (
        <CheckoutForm
            product={product}
            clientSecret={paymentIntent.client_secret}
        />
    );
};

export default PurchasePage;
