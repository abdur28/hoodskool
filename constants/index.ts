import { Currency } from "@/types/types";

export const availableCurrencies: Currency[] = [
    {
        name: "RUB",
        code: "rub",
        symbol: "₽",
        isDefault: true
    },
    {
        name: "USD",
        code: "usd",
        symbol: "$"
    }
]

export async function getAvailableCurrencies() {
    return availableCurrencies;
}