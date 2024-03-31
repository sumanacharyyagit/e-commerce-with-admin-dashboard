"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency } from "@/lib/formatters";
import React, { useState } from "react";
import { addProduct } from "../../_actions/products";
import { useFormState, useFormStatus } from "react-dom";

const AdminProductForm = () => {
    const [error, action] = useFormState(addProduct, {});

    const [priceInCents, setPriceInCents] = useState<number>();
    return (
        <form action={action} className="space-y-8">
            <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input type="text" id="name" name="name" required />
                {error?.name && (
                    <div className="text-destructive">{error.name}</div>
                )}
            </div>
            <div className="space-y-2">
                <Label htmlFor="priceInCents">Price In Cents</Label>
                <Input
                    type="number"
                    id="priceInCents"
                    name="priceInCents"
                    required
                    value={priceInCents}
                    onChange={(e) =>
                        setPriceInCents(Number(e.target.value || undefined))
                    }
                />
                {error?.priceInCents && (
                    <div className="text-destructive">{error.priceInCents}</div>
                )}
                <div className="text-muted-foreground">
                    {formatCurrency((priceInCents || 0) / 100)}
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" required />
                {error?.description && (
                    <div className="text-destructive">{error.description}</div>
                )}
            </div>
            <div className="space-y-2">
                <Label htmlFor="file">File</Label>
                <Input type="file" id="file" name="file" required />
                {error?.file && (
                    <div className="text-destructive">{error.file}</div>
                )}
            </div>
            <div className="space-y-2">
                <Label htmlFor="image">Image</Label>
                <Input type="file" id="image" name="image" required />
                {error?.image && (
                    <div className="text-destructive">{error.image}</div>
                )}
            </div>
            <SubmitNutton text="Save" loadingText="Saving..." />
        </form>
    );
};

const SubmitNutton = ({
    text,
    loadingText,
}: {
    text: string;
    loadingText: string;
}) => {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending ? loadingText : text}
        </Button>
    );
};

export default AdminProductForm;