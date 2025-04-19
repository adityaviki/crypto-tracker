import React from "react";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Tooltip,
	Legend,
	ChartOptions,
	ChartData,
} from "chart.js";
import { Line } from "react-chartjs-2";
import styles from "@/styles/market-cap-chart.module.css";
import { CryptoCoin } from "@/lib/types";

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Tooltip,
	Legend
);

const MarketCapChart = ({ selectedCoin }: { selectedCoin: CryptoCoin }) => {
	const labels: string[] = ["90d", "60d", "30d", "7d", "24h", "1h"];

	const percentChanges: number[] = [
		selectedCoin.percent_change_90d,
		selectedCoin.percent_change_60d,
		selectedCoin.percent_change_30d,
		selectedCoin.percent_change_7d,
		selectedCoin.percent_change_24h,
		selectedCoin.percent_change_1h,
	];

	const data: ChartData<"line"> = {
		labels,
		datasets: [
			{
				label: "Market Cap % Change",
				data: percentChanges,
				borderColor: "rgba(75, 192, 192, 1)",
				backgroundColor: "rgba(75, 192, 192, 0.2)",
				fill: true,
				tension: 0.4,
				pointBackgroundColor: "black",
			},
		],
	};

	const options: ChartOptions<"line"> = {
		responsive: true,
		scales: {
			y: {
				beginAtZero: false,
				ticks: {
					callback: function (value) {
						return `${value}%`;
					},
				},
			},
		},
		plugins: {
			tooltip: {
				callbacks: {
					label: function (context) {
						return `${
							context.dataset.label
						}: ${context.parsed.y.toFixed(2)}%`;
					},
				},
			},
			legend: {
				display: false,
			},
		},
	};

	return (
		<div className={styles.marketCapChartContainer}>
			<div className={styles.marketCapChartTitle}>
				{`${selectedCoin.name} Market Cap % Change`}
			</div>
			<Line data={data} options={options} />
		</div>
	);
};

export default MarketCapChart;
