"use client";
import styles from "@/styles/home.module.css";
import { CryptoCoin, RawCryptoData } from "@/lib/types";
import { useEffect, useState } from "react";
import { coinMarketCapApi } from "@/lib/coin-market-cap-api-helper";
import { API_CONFIG } from "@/config/api-config";
import CryptoList from "./CryptoList";
import {
	Select,
	MenuItem,
	TextField,
	Box,
	CircularProgress,
} from "@mui/material";
import { getFormattedCryptoCoins } from "@/lib/utils";
import CoinDetailsModal from "./CoinDetailsModal";
import RecentlyViewedCoins from "./RecentlyViewedCoins";

const fetchCryptoCoins = async ({ currency }: { currency: string }) => {
	const url = `/cryptocurrency/listings/latest?limit=50&convert=${currency}`;
	const response = await coinMarketCapApi({ url });

	if (!response.ok) {
		throw new Error(`Failed to fetch crypto coins`);
	}

	const newCryptoCoins = getFormattedCryptoCoins({
		data: response.data.data as RawCryptoData[],
		currency: currency,
	});

	return newCryptoCoins;
};

export default function Home() {
	const [cryptoCoins, setCryptoCoins] = useState<CryptoCoin[]>([]);
	const [selectedCoin, setSelectedCoin] = useState<CryptoCoin | null>(null);
	const [perPage, setPerPage] = useState<number>(10);
	const [searchTerm, setSearchTerm] = useState<string>("");
	const [searchResults, setSearchResults] = useState<CryptoCoin[]>([]);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const [selectedCurrency, setSelectedCurrency] = useState<string>(
		API_CONFIG.DEFAULT_CURRENCY
	);

	useEffect(() => {
		setIsLoading(true);
		fetchCryptoCoins({ currency: selectedCurrency })
			.then((data) => {
				setCryptoCoins(data as CryptoCoin[]);
			})
			.catch((error) => {
				console.error(error);
			})
			.finally(() => {
				setIsLoading(false);
			});
	}, [selectedCurrency]);

	useEffect(() => {
		if (searchTerm.length > 0) {
			const sanitizedSearchTerm = searchTerm.toLowerCase().trim();
			setSearchResults(
				cryptoCoins.filter(
					(coin) =>
						coin.name.toLowerCase().includes(sanitizedSearchTerm) ||
						coin.symbol.toLowerCase().includes(sanitizedSearchTerm)
				)
			);
			setCurrentPage(1);
		} else {
			setSearchResults(cryptoCoins);
		}
	}, [cryptoCoins, searchTerm]);

	return (
		<div className={styles.mainContainer}>
			{searchResults.length > 0 && (
				<>
					<div className={styles.title}>Crypto Tracker</div>
					<div className={styles.searchContainer}>
						<TextField
							sx={{
								width: "200px",
							}}
							value={searchTerm}
							onChange={(event) => {
								setSearchTerm(event.target.value);
							}}
							size="small"
							variant="outlined"
							label="Search"
						/>
						<Select
							value={selectedCurrency}
							renderValue={(selected) => (
								<Box
									sx={{
										display: "flex",
										alignItems: "center",
										gap: 1,
									}}
								>
									{selected || "Select Currency"}
									{isLoading && (
										<CircularProgress
											size={16}
											thickness={5}
										/>
									)}
								</Box>
							)}
							disabled={isLoading}
							onChange={(event) => {
								setSelectedCurrency(event.target.value);
							}}
							displayEmpty
							inputProps={{
								"aria-label": "Select Currency",
							}}
							sx={{ minWidth: 120 }}
							size="small"
						>
							{API_CONFIG.CURRENCY_OPTIONS.map((currency) => (
								<MenuItem key={currency} value={currency}>
									{currency}
								</MenuItem>
							))}
						</Select>
					</div>
					<div className={styles.mainContent}>
						<CryptoList
							{...{
								perPage,
								setPerPage,
								setCurrentPage,
								searchResults,
								currentPage,
								setSelectedCoin,
							}}
						/>
						<RecentlyViewedCoins
							{...{
								cryptoCoins,
								setSelectedCoin,
								selectedCoin,
							}}
						/>
					</div>
				</>
			)}
			<CoinDetailsModal
				selectedCoin={selectedCoin}
				selectedCurrency={selectedCurrency}
				setSelectedCoin={setSelectedCoin}
			/>
		</div>
	);
}
