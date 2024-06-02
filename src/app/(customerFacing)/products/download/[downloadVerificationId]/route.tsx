import db from "@/db/db";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";

export async function GET(
    req: NextRequest,
    {
        params: { downloadVerificationId },
    }: { params: { downloadVerificationId: string } }
) {
    const data = await db.downloadVerification.findUnique({
        where: {
            id: downloadVerificationId,
            expires: { gt: new Date() },
        },
        select: {
            product: { select: { id: true, name: true, filePath: true } },
        },
    });

    if (!data) {
        return NextResponse.redirect(
            new URL("/products/download/expired", req.url)
        );
    }

    const { size } = await fs.stat(data.product.filePath);
    const file = await fs.readFile(data.product.filePath);
    const extension = data.product.filePath.split(".").pop();

    return new NextResponse(file, {
        headers: {
            "Content-Disposition": `attachment; filename="${data.product.name}.${extension}"`,
            "Content-Length": size.toString(),
        },
    });
}
