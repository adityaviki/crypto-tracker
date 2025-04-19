"use client";
import Image from "next/image";
import styles from "@/styles/recently-viewed-coins.module.css";
import { CryptoCoin } from "@/lib/types";
import { useEffect, useState } from "react";

const updateRecentlyViewedCoins = ({
	coinId,
}: {
	coinId: number | undefined;
}) => {
	const recentlyViewedCoins = JSON.parse(
		localStorage.getItem("recentlyViewedCoins") || "[]"
	);

	if (!coinId) return recentlyViewedCoins;

	const updatedCoins = recentlyViewedCoins.filter(
		(value: number) => value !== coinId
	);

	updatedCoins.unshift(coinId);

	if (updatedCoins.length > 10) {
		updatedCoins.pop();
	}

	localStorage.setItem("recentlyViewedCoins", JSON.stringify(updatedCoins));

	return updatedCoins;
};

const RecentlyViewedCoins = ({
	cryptoCoins,
	setSelectedCoin,
	selectedCoin,
}: {
	cryptoCoins: CryptoCoin[];
	setSelectedCoin: (coin: CryptoCoin) => void;
	selectedCoin: CryptoCoin | null;
}) => {
	const [recentlyViewedCoins, setRecentlyViewedCoins] = useState<number[]>(
		[]
	);

	useEffect(() => {
		const updatedRecentlyViewedCoins = updateRecentlyViewedCoins({
			coinId: selectedCoin?.id,
		});

		setRecentlyViewedCoins(updatedRecentlyViewedCoins as number[]);
	}, [selectedCoin]);

	return (
		<div className={styles.recentlyViewedContainer}>
			<div className={styles.recentlyViewedTitle}>
				Recently Viewed Coins
			</div>
			<div className={styles.recentlyViewedList}>
				{recentlyViewedCoins.map((coinId, index) => {
					const coin = cryptoCoins.find((coin) => coin.id === coinId);

					if (!coin) return null;

					return (
						<div
							key={index}
							className={styles.recentlyViewedCoin}
							onClick={() => {
								setSelectedCoin(coin);
							}}
						>
							<Image
								src={`https://s2.coinmarketcap.com/static/img/coins/64x64/${coin.id}.png`}
								alt={coin.name}
								width={24}
								height={24}
							/>
							<span>{coin.name}</span>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default RecentlyViewedCoins;
