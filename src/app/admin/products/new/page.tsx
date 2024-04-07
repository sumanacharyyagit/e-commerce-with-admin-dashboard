import React from "react";
import PageHeader from "../../_components/PageHeader";
import ProductForm from "../_components/ProductForm";

const AdminNewProductPage = () => {
    return (
        <>
            <PageHeader>Add Product</PageHeader>
            <ProductForm />
        </>
    );
};

export default AdminNewProductPage;
