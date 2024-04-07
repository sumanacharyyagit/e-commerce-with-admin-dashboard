import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import db from "@/db/db";
import { formatCurrency, formatNumber } from "@/lib/formatters";
import { CheckCircle2, MoreVertical, XCircle } from "lucide-react";
import Link from "next/link";
import PageHeader from "../_components/PageHeader";
import {
    ActiveToggleDropdownItem,
    DeleteDropdownItem,
} from "./_components/ProductActions";

const AdminProductPage = () => {
    return (
        <>
            <div className="flex justify-between items-center gap-4">
                <PageHeader>Products</PageHeader>
                <Button asChild>
                    <Link href={"products/new"}>Add product</Link>
                </Button>
            </div>
            <ProductsTable />
        </>
    );
};

const ProductsTable = async () => {
    const products = await db.product.findMany({
        select: {
            id: true,
            name: true,
            priceInCents: true,
            isAvailableForPurchase: true,
            _count: { select: { orders: true } },
        },
        orderBy: { name: "desc" },
    });

    if (products.length === 0) return <p>No products found</p>;
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-0">
                        <span className="sr-only">Available for purchase</span>
                    </TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead className="w-0">
                        <span className="sr-only">Actions</span>
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {products.map((item) => (
                    <TableRow key={item.id}>
                        <TableCell>
                            {item.isAvailableForPurchase ? (
                                <>
                                    <span className="sr-only">Available</span>
                                    <CheckCircle2 />{" "}
                                </>
                            ) : (
                                <>
                                    <span className="sr-only">unavailable</span>
                                    <XCircle className="stroke-destructive" />
                                </>
                            )}
                        </TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>
                            {formatCurrency(item.priceInCents / 100)}
                        </TableCell>
                        <TableCell>
                            {formatNumber(item._count.orders)}
                        </TableCell>
                        <TableCell>
                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    <MoreVertical />
                                    <span className="sr-only">Actions</span>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem asChild>
                                        <a
                                            download
                                            href={`/admin/products/${item.id}/download`}
                                        >
                                            Download
                                        </a>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link
                                            href={`/admin/products/${item.id}/edit`}
                                        >
                                            Edit
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <ActiveToggleDropdownItem
                                        id={item.id}
                                        isAvailableForPurchase={
                                            item.isAvailableForPurchase
                                        }
                                    />
                                    <DeleteDropdownItem
                                        id={item.id}
                                        disabled={item._count.orders > 0}
                                    />
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default AdminProductPage;
