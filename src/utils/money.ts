const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export function formatCurrency(amount: number): string {
    return currency.format(amount);
}
