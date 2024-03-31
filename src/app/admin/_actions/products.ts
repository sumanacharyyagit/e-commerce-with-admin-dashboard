"use server";

import db from "@/db/db";
import { z } from "zod";
import fs from "fs/promises";
import { redirect } from "next/navigation";
import { File } from "buffer";

const fileSchema = z.instanceof(File, { message: "Required" });
const imageSchema = fileSchema.refine(
    (image) => image.size === 0 || image.type.startsWith("image/")
);

const addSchema = z.object({
    name: z.string().min(3),
    description: z.string().min(3),
    priceInCents: z.coerce.number().int().min(1),
    file: fileSchema.refine((file) => file.size > 0, "Required"),
    image: imageSchema.refine((image) => image.size > 0, "Required"),
});

export const addProduct = async (prevState: unknown, formData: FormData) => {
    const result = addSchema.safeParse(Object.fromEntries(formData.entries()));
    if (result.success !== true) {
        return result.error.formErrors.fieldErrors;
    }
    const data = result.data;

    await fs.mkdir("products", { recursive: true });
    const filePath = `products/${crypto.randomUUID()}-${data.file.name}`;
    await fs.writeFile(filePath, Buffer.from(await data.file.arrayBuffer()));

    await fs.mkdir("public/products", { recursive: true });
    const imagePath = `/products/${crypto.randomUUID()}-${data.image.name}`;
    await fs.writeFile(
        `public${imagePath}`,
        Buffer.from(await data.image.arrayBuffer())
    );

    await db.product.create({
        data: {
            isAvailableForPurchase: false,
            name: data.name,
            priceInCents: data.priceInCents,
            description: data.description,
            imagePath,
            filePath,
        },
    });

    redirect("/admin/products");
};
