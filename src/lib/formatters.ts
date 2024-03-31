const CURRENCY_FORMATTER = Intl.NumberFormat("en-US", {
    currency: "USD",
    style: "currency",
    minimumFractionDigits: 0,
});

export const formatCurrency = (amount: number) => {
    return CURRENCY_FORMATTER.format(amount);
};

const NUMBER_FORMATTER = Intl.NumberFormat("en-US");

export const formatNumber = (number: number) => {
    return NUMBER_FORMATTER.format(number);
};
