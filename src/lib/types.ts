export type CryptoCoin = {
	id: number;
	name: string;
	symbol: string;
	cmc_rank: number;
	last_updated: string;
	currency: string;
	price: number;
	volume_24h: number;
	volume_change_24h: number;
	percent_change_1h: number;
	percent_change_24h: number;
	percent_change_7d: number;
	percent_change_30d: number;
	percent_change_60d: number;
	percent_change_90d: number;
	market_cap: number;
};

export type RawCryptoData = {
	id: number;
	name: string;
	symbol: string;
	cmc_rank: number;
	last_updated: string; // ISO 8601 date string
	quote: {
		[currency: string]: {
			price: number;
			volume_24h: number;
			volume_change_24h: number;
			percent_change_1h: number;
			percent_change_24h: number;
			percent_change_7d: number;
			percent_change_30d: number;
			percent_change_60d: number;
			percent_change_90d: number;
			market_cap: number;
		};
	};
};

export type CoinMetadata = {
	id: number;
	logo: string;
	website: string;
	date_launched: string;
};
