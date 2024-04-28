import React from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "./ui/card";
import Image from "next/image";
import Link from "next/link";
import { formatCurrency } from "@/lib/formatters";
import { Button } from "./ui/button";

type TProductCardProps = {
    id: string;
    name: string;
    priceInCents: number;
    description: string;
    imagePath: string;
};

const ProductCard = ({
    id,
    name,
    priceInCents,
    description,
    imagePath,
}: TProductCardProps) => {
    return (
        <Card className="flex overflow-hidden flex-col">
            <div className="relative w-full h-auto aspect-video">
                <Image src={imagePath} alt={name} fill />
            </div>
            <CardHeader>
                <CardTitle>{name}</CardTitle>
                <CardDescription>
                    {formatCurrency(priceInCents / 100)}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
                <p className="line-clamp-4">{description}</p>
            </CardContent>
            <CardFooter>
                <Button asChild size={"lg"} className="w-full">
                    <Link href={`/products/${id}/purchase`}>Purchase</Link>
                </Button>
            </CardFooter>
        </Card>
    );
};

const ProductCardSkeleton = () => (
    <Card className="flex overflow-hidden flex-col animate-pulse">
        <div className="relative w-full h-auto aspect-video">
            <div className="w-full aspect-video bg-gray-300"></div>
        </div>
        <CardHeader>
            <CardTitle>
                <div className="w-3/4 h-6 rounded-full bg-gray-300"></div>
            </CardTitle>
            <CardDescription>
                <div className="w-1/2 h-4 rounded-full bg-gray-300"></div>
            </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
            <div className="w-full h-4 rounded-full bg-gray-300"></div>
            <div className="w-full h-4 rounded-full bg-gray-300"></div>
            <div className="w-3/4 h-4 rounded-full bg-gray-300"></div>
        </CardContent>
        <CardFooter>
            <Button disabled size={"lg"} className="w-full"></Button>
        </CardFooter>
    </Card>
);

export { ProductCard, ProductCardSkeleton };
