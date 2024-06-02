import { Button } from "@/components/ui/button";
import db from "@/db/db";
import { formatCurrency } from "@/lib/formatters";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

const PurchaseSuccessPage = async ({
    searchParams,
}: {
    searchParams: { payment_intent: string };
}) => {
    const paymentIntent = await stripe.paymentIntents.retrieve(
        searchParams.payment_intent
    );

    if (!paymentIntent.metadata.productId) return notFound();

    const product = await db.product.findUnique({
        where: { id: paymentIntent.metadata.productId },
    });

    if (!product) return notFound();

    const paymentIsSuccess = paymentIntent.status === "succeeded";

    return (
        <>
            <div className="max-w-5xl w-full mx-auto space-y-8">
                <h1 className="text-4xl font-bold">
                    {paymentIsSuccess ? "Success!" : "Error"}
                </h1>
                <div className="flex gap-4 items-center">
                    <div className="aspect-video flex-shrink-0 w-1/3 relative">
                        <Image
                            src={product.imagePath}
                            alt={product.name}
                            fill
                            className="object-cover rounded-lg"
                        />
                    </div>
                    <div>
                        <div className="text-lg">
                            {formatCurrency(product.priceInCents / 100)}
                        </div>
                        <h1 className="text-2xl font-bold">{product.name}</h1>
                        <div className="line-clamp-3 text-muted-foreground">
                            {product.description}
                        </div>
                        <Button className="mt-4 " size={"lg"} asChild>
                            {paymentIsSuccess ? (
                                <a
                                    href={`/products/download/${await createDownloadVerification(
                                        product.id
                                    )}`}
                                >
                                    Download
                                </a>
                            ) : (
                                <Link href={`/products/${product.id}/purchase`}>
                                    Try again
                                </Link>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
};

const createDownloadVerification = async (productId: string) => {
    return (
        await db.downloadVerification.create({
            data: {
                productId,
                expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
            },
        })
    ).id;
};

export default PurchaseSuccessPage;
