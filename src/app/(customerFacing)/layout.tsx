import { Nav, NavLink } from "@/components/Nav";
import React from "react";

export const dynamic = "force-dynamic"; // not to cache the admin pages

const Layout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    return (
        <>
            <Nav>
                <NavLink href={"/"}>Home</NavLink>
                <NavLink href={"/products"}>Products</NavLink>
                <NavLink href={"/orders"}>My Orders</NavLink>
            </Nav>
            <div className="container my-6">{children}</div>
        </>
    );
};

export default Layout;
