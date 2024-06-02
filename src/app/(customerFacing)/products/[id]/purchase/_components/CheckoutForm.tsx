"use client";
import { userOrderExists } from "@/app/actions/order";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { formatCurrency } from "@/lib/formatters";
import {
    Elements,
    LinkAuthenticationElement,
    PaymentElement,
    useElements,
    useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Image from "next/image";
import React, { FormEvent, useState } from "react";

type TCheckoutFormProps = {
    product: {
        id: string;
        imagePath: string;
        name: string;
        priceInCents: number;
        description: string;
    };
    clientSecret: string;
};

const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string
);

const CheckoutForm = ({ product, clientSecret }: TCheckoutFormProps) => {
    return (
        <>
            <div className="max-w-5xl w-full mx-auto space-y-8">
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
                    </div>
                </div>
                <Elements options={{ clientSecret }} stripe={stripePromise}>
                    <Form
                        priceInCents={product.priceInCents}
                        productId={product.id}
                    />
                </Elements>
            </div>
        </>
    );
};

const Form = ({
    priceInCents,
    productId,
}: {
    priceInCents: number;
    productId: string;
}) => {
    const stripe = useStripe();
    const elements = useElements();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [email, setEmail] = useState<string>("");

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!stripe || !elements || !email) return;
        setIsLoading(true);

        // check for existing order
        const orderExists = await userOrderExists(email, productId);

        if (!orderExists) {
            setErrorMessage(
                "This product already purchased, try to download from My Orders Page"
            );
            setIsLoading(false);
            return;
        }
        console.log("HERE");

        stripe
            .confirmPayment({
                elements,
                confirmParams: {
                    return_url: `${
                        process.env.NEXT_PUBLIC_SERVER_URL as string
                    }/stripe/purchase-success`,
                    payment_method_data: {
                        billing_details: {
                            name: "Test Data",
                            email: "testdata@email.co",
                            address: {
                                line1: "123 Main St", // Add the customer's address details here
                                city: "City",
                                postal_code: "123456",
                                state: "State",
                                country: "IN", // Ensure the country is set to India
                            },
                        },
                    },
                },
            })
            .then(({ error }) => {
                console.log(error, "error");

                if (
                    error.type === "card_error" ||
                    error.type === "validation_error"
                )
                    setErrorMessage(error?.message ?? "");
                else setErrorMessage("An unknown error occured");
            })
            .finally(() => setIsLoading(false));
    };

    return (
        <form onSubmit={handleSubmit}>
            <Card>
                <CardHeader>
                    <CardTitle>Checkout</CardTitle>
                    {errorMessage && (
                        <CardDescription className="text-destructive">
                            {errorMessage}
                        </CardDescription>
                    )}
                </CardHeader>
                <CardContent>
                    <PaymentElement />
                    <div className="mt-4">
                        <LinkAuthenticationElement
                            onChange={(e) => setEmail(e.value.email)}
                        />
                    </div>
                    <CardFooter>
                        <Button
                            className="mt-7 w-full"
                            size={"lg"}
                            disabled={!stripe || !elements || isLoading}
                        >
                            {isLoading
                                ? "Purchasing..."
                                : `Purchase - ${formatCurrency(
                                      priceInCents / 100
                                  )}`}
                        </Button>
                    </CardFooter>
                </CardContent>
            </Card>
        </form>
    );
};

export default CheckoutForm;
