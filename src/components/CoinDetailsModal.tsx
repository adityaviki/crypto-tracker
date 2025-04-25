"use client";

import CloseIcon from "@mui/icons-material/CloseRounded";
import styles from "@/styles/coin-details.module.css";
import { CoinMetadata, CryptoCoin } from "@/lib/types";
import { formatNumberCompact } from "@/lib/utils";
import { useEffect, useState } from "react";
import { coinMarketCapApi } from "@/lib/coin-market-cap-api-helper";
import MarketCapChart from "./MarketCapChart";

const fetchCoinMetadata = async ({ coinId }: { coinId: number }) => {
	const url = `/cryptocurrency/info?id=${coinId}`;
	const response = await coinMarketCapApi({ url });

	if (!response.ok) {
		throw new Error("Failed to fetch Coin Metadata");
	}

	const data = response.data.data[coinId];

	const coinMetadata = {
		id: data?.id,
		logo: data?.logo,
		website: data?.urls?.website?.[0],
		date_launched: data?.date_launched,
	};

	return coinMetadata;
};

const CoinDetailsModal = ({
	selectedCoin,
	selectedCurrency,
	setSelectedCoin,
}: {
	selectedCoin: CryptoCoin | null;
	selectedCurrency: string;
	setSelectedCoin: (val: CryptoCoin | null) => void;
}) => {
	const [coinMetadata, setCoinMetadata] = useState<CoinMetadata | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	useEffect(() => {
		if (!selectedCoin) return;
		setIsLoading(true);
		fetchCoinMetadata({ coinId: selectedCoin.id })
			.then((newCoinMetadata) => {
				setCoinMetadata(newCoinMetadata as CoinMetadata);
			})
			.catch((e) => {
				console.error(e);
			})
			.finally(() => setIsLoading(false));
	}, [selectedCoin]);

	useEffect(() => {
		if (!coinMetadata) return;
		const previousTitle = document.title;
		document.title = `${
			selectedCoin?.name || "Coin"
		} Details | Crypto Coin`;

		return () => {
			document.title = previousTitle;
		};
	}, [coinMetadata]);

	return (
		<>
			{selectedCoin && (
				<>
					<div
						className={styles.modalContainerBackground}
						onClick={() => {
							setSelectedCoin(null);
						}}
					/>
					<div className={styles.modalContainer}>
						<>
							<div
								onClick={() => {
									setSelectedCoin(null);
								}}
								className={styles.closeButton}
							>
								<CloseIcon
									style={{
										color: "#424242",
										cursor: "pointer",
									}}
								/>
							</div>
							{isLoading && (
								<div className={styles.loaderContainer}>
									<div className={styles.loader} />
								</div>
							)}
							{!isLoading && coinMetadata && (
								<>
									<div className={styles.coinIconAndName}>
										<img
											src={`https://s2.coinmarketcap.com/static/img/coins/64x64/${selectedCoin.id}.png`}
											alt={selectedCoin.name}
											width={32}
											height={32}
										/>
										<div className={styles.coinName}>
											{selectedCoin.name} (
											{selectedCoin.symbol})
										</div>
									</div>
									{coinMetadata?.website && (
										<div className={styles.websiteLink}>
											<a
												href={coinMetadata.website}
												target="_blank"
												rel="noopener noreferrer"
											>
												{coinMetadata.website}
											</a>
										</div>
									)}
									<div className={styles.coinDetailsOuter}>
										<div
											className={
												styles.coinDetailsContainer
											}
										>
											<div className={styles.coinDetails}>
												<div
													className={
														styles.coinDetailsRow
													}
												>
													<div
														className={
															styles.coinDetailsLabel
														}
													>
														Price
													</div>
													<div
														className={
															styles.coinDetailsValue
														}
													>
														{formatNumberCompact(
															selectedCoin.price,
															selectedCurrency
														)}
													</div>
												</div>
												<div
													className={
														styles.coinDetailsRow
													}
												>
													<div
														className={
															styles.coinDetailsLabel
														}
													>
														Market Cap
													</div>
													<div
														className={
															styles.coinDetailsValue
														}
													>
														{formatNumberCompact(
															selectedCoin.market_cap,
															selectedCurrency
														)}
													</div>
												</div>
												<div
													className={
														styles.coinDetailsRow
													}
												>
													<div
														className={
															styles.coinDetailsLabel
														}
													>
														24h Volume
													</div>
													<div
														className={
															styles.coinDetailsValue
														}
													>
														{formatNumberCompact(
															selectedCoin.volume_24h,
															selectedCurrency
														)}
													</div>
												</div>
												<div
													className={
														styles.coinDetailsRow
													}
												>
													<div
														className={
															styles.coinDetailsLabel
														}
													>
														24h Volume Change
													</div>
													<div
														className={
															selectedCoin.percent_change_24h >=
															0
																? styles.positiveChange
																: styles.negativeChange
														}
													>
														{selectedCoin.volume_change_24h.toFixed(
															2
														)}
														%
													</div>
												</div>
												<div
													className={
														styles.coinDetailsRow
													}
												>
													<div
														className={
															styles.coinDetailsLabel
														}
													>
														Last Updated
													</div>
													<div
														className={
															selectedCoin.percent_change_24h >=
															0
																? styles.positiveChange
																: styles.negativeChange
														}
													>
														{new Date(
															selectedCoin.last_updated
														).toLocaleString()}
													</div>
												</div>
											</div>
										</div>
										<div
											className={
												styles.marketCapChartContainer
											}
										>
											<MarketCapChart
												selectedCoin={selectedCoin}
											/>
										</div>
									</div>
								</>
							)}
						</>
					</div>
				</>
			)}
		</>
	);
};

export default CoinDetailsModal;
