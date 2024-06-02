"use server";

import db from "@/db/db";

export const userOrderExists = async (email: string, productId: string) => {
    console.log(email, productId);

    const order = await db.order.findFirst({
        where: { user: { email }, productId },
        select: { id: true },
    });
    console.log(order, " <<< order");

    return !order;
};
