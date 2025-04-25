"use server";

import Home from "@/components/Home";
import { API_CONFIG } from "@/config/api-config";
import { coinMarketCapApi } from "@/lib/coin-market-cap-api-helper";
import { RawCryptoData } from "@/lib/types";
import { getFormattedCryptoCoins } from "@/lib/utils";

export default async function Page() {
	const url = `/cryptocurrency/listings/latest?limit=50&convert=${API_CONFIG.DEFAULT_CURRENCY}`;
	const response = await coinMarketCapApi({ url });

	if (!response.ok) {
		throw new Error(`Failed to fetch crypto coins`);
	}

	const newCryptoCoins = getFormattedCryptoCoins({
		data: response.data.data as RawCryptoData[],
		currency: API_CONFIG.DEFAULT_CURRENCY,
	});

	return <Home newCryptoCoins={newCryptoCoins} />;
}
