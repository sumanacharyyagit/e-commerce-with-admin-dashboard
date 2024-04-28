import { ProductCard, ProductCardSkeleton } from "@/components/ProductCard";
import db from "@/db/db";
import { cache } from "@/lib/cache";
import React, { Suspense } from "react";

const getProducts = cache(async () => {
    return await db.product.findMany({
        where: {
            isAvailableForPurchase: true,
        },
        orderBy: {
            name: "asc",
        },
    });
}, ["/products", "getProducts"]);

const ProductsPage = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Suspense
                fallback={
                    <>
                        <ProductCardSkeleton />
                        <ProductCardSkeleton />
                        <ProductCardSkeleton />
                        <ProductCardSkeleton />
                        <ProductCardSkeleton />
                        <ProductCardSkeleton />
                    </>
                }
            >
                <ProductsSuspense />
            </Suspense>
        </div>
    );
};

const ProductsSuspense = async () => {
    const products = await getProducts();
    return products.map((product) => (
        <ProductCard key={product.id} {...product} />
    ));
};

export default ProductsPage;
