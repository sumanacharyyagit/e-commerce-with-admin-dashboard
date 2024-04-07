import PageHeader from "@/app/admin/_components/PageHeader";
import AdminProductForm from "../../_components/ProductForm";
import db from "@/db/db";

const AdminEditProductPage = async ({
    params: { id },
}: {
    params: { id: string };
}) => {
    const product = await db.product.findUnique({ where: { id } });

    return (
        <>
            <PageHeader>Add Product</PageHeader>
            <AdminProductForm product={product} />
        </>
    );
};

export default AdminEditProductPage;
