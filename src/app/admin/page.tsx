import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import db from "@/db/db";
import { formatCurrency, formatNumber } from "@/lib/formatters";
import React from "react";

const AdminDashboard = async () => {
    const getSalesData = async () => {
        try {
            const data = await db.order.aggregate({
                _sum: { pricePaidInCents: true },
                _count: true,
            });
            return {
                amount: (data._sum.pricePaidInCents || 0) / 100,
                numberOfSales: data._count || 0,
            };
        } catch (error) {
            console.log("ERROR >>> ", error);

            return {
                amount: 0 / 100,
                numberOfSales: 0,
            };
        }
    };

    const getUserData = async () => {
        try {
            const [userCount, orderData] = await Promise.all([
                db.user.count(),
                db.order.aggregate({
                    _sum: { pricePaidInCents: true },
                }),
            ]);
            return {
                userCount,
                averageValuePerUser:
                    userCount === 0
                        ? 0
                        : (orderData._sum.pricePaidInCents || 0) /
                          userCount /
                          100,
            };
        } catch (error) {
            console.log("ERROR >>> ", error);

            return {
                userCount: 0,
                averageValuePerUser: 0,
            };
        }
    };

    const getProductData = async () => {
        try {
            const [activeCount, inActiveCount] = await Promise.all([
                db.product.count({ where: { isAvailableForPurchase: true } }),
                db.product.count({ where: { isAvailableForPurchase: false } }),
            ]);
            return {
                activeCount,
                inActiveCount,
            };
        } catch (error) {
            console.log("ERROR >>> ", error);

            return {
                activeCount: 0,
                inActiveCount: 0,
            };
        }
    };

    const [
        { numberOfSales, amount },
        { userCount, averageValuePerUser },
        { activeCount, inActiveCount },
    ] = await Promise.all([getSalesData(), getUserData(), getProductData()]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <DashboardCard
                title="Sales"
                subTitle={`${formatNumber(numberOfSales)} orders`}
                body={formatCurrency(amount)}
            />
            <DashboardCard
                title="Customer"
                subTitle={`${formatCurrency(
                    averageValuePerUser
                )} average value`}
                body={formatNumber(userCount)}
            />
            <DashboardCard
                title="Active Products"
                subTitle={`${formatNumber(inActiveCount)} inactive`}
                body={formatNumber(activeCount)}
            />
        </div>
    );
};

type TDashboardCardProps = {
    title: string;
    subTitle: string;
    body: string;
};

const DashboardCard = ({
    title = "",
    subTitle = "",
    body = "",
}: TDashboardCardProps) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{subTitle}</CardDescription>
            </CardHeader>
            <CardContent>
                <p>{body}</p>
            </CardContent>
        </Card>
    );
};

export default AdminDashboard;
