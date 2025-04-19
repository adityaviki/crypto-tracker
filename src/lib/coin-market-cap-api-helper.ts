"use server";

import { API_CONFIG } from "@/config/api-config";

export const coinMarketCapApi = async ({ url }: { url: string }) => {
	try {
		const cleanUrl = url.replace(/^\/+/, "");
		const apiEndpoint = `${API_CONFIG.COIN_MARKET_CAP_BASE_URL}${cleanUrl}`;

		const response = await fetch(apiEndpoint, {
			headers: {
				"X-CMC_PRO_API_KEY": process.env.COIN_MARKET_CAP_API_KEY!,
			},
		});

		if (!response.ok) {
			const errorBody = await response.text();
			throw new Error(
				`CoinMarketCap API Error: ${response.status} ${response.statusText} - ${errorBody}`
			);
		}

		const data = await response.json();
		return {
			ok: true,
			data,
		};
	} catch (error) {
		console.error("CoinMarketCap API request failed:", error);
		return {
			ok: false,
		};
	}
};
