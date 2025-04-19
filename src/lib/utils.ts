import { CryptoCoin, RawCryptoData } from "./types";

export function formatNumberCompact(
	value: number,
	currency: string | null = null
): string {
	let formatted: string;

	if (value >= 1e12) {
		formatted = (value / 1e12).toFixed(2) + "T";
	} else if (value >= 1e9) {
		formatted = (value / 1e9).toFixed(2) + "B";
	} else if (value >= 1e6) {
		formatted = (value / 1e6).toFixed(2) + "M";
	} else if (value >= 1e3) {
		formatted = (value / 1e3).toFixed(2) + "K";
	} else {
		formatted = value.toFixed(2);
	}

	if (currency) {
		const currencySymbol =
			new Intl.NumberFormat("en-US", {
				style: "currency",
				currency,
				maximumFractionDigits: 0,
			})
				.formatToParts(0)
				.find((part) => part.type === "currency")?.value || "";

		return `${currencySymbol}${formatted}`;
	}

	return formatted;
}

export const getFormattedCryptoCoins = ({
	data,
	currency,
}: {
	data: RawCryptoData[];
	currency: string;
}): CryptoCoin[] => {
	return data?.map((coin: RawCryptoData) => ({
		...coin,
		currency,
		...coin?.quote?.[currency],
	}));
};
