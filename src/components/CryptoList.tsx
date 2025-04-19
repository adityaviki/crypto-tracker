"use client";
import Image from "next/image";
import styles from "@/styles/crypto-list.module.css";
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Pagination,
	Select,
	SelectChangeEvent,
	MenuItem,
} from "@mui/material";

import { formatNumberCompact } from "@/lib/utils";
import { CryptoCoin } from "@/lib/types";
import { useEffect, useState } from "react";
import { SwapVertRounded } from "@mui/icons-material";

type Sort = {
	column: keyof CryptoCoin;
	order: "asc" | "desc";
};

type TableColumn = {
	name: Sort["column"];
	displayName: string;
};

const SortCryptoCoins = ({
	sort,
	searchResults,
}: {
	sort: Sort;
	searchResults: CryptoCoin[];
}) => {
	const sortedValues = [...searchResults].sort((a, b) => {
		const aField = a[sort.column as keyof CryptoCoin];
		const bField = b[sort.column as keyof CryptoCoin];

		if (typeof aField === "number" && typeof bField === "number") {
			return sort.order === "asc" ? aField - bField : bField - aField;
		}

		const aValue = aField.toString();
		const bValue = bField.toString();

		return sort.order === "asc"
			? aValue.localeCompare(bValue)
			: bValue.localeCompare(aValue);
	});

	return sortedValues;
};

const tableCoulmns: TableColumn[] = [
	{
		name: "cmc_rank",
		displayName: "Rank",
	},
	{
		name: "name",
		displayName: "Coin",
	},
	{
		name: "price",
		displayName: "Price",
	},
	{
		name: "market_cap",
		displayName: "Market Cap",
	},
	{
		name: "percent_change_24h",
		displayName: "24h Change",
	},
	{
		name: "percent_change_7d",
		displayName: "7d Change",
	},
	{
		name: "volume_24h",
		displayName: "7h Volume",
	},
	{
		name: "volume_change_24h",
		displayName: "24h Volume Change",
	},
];

const CryptoList = ({
	perPage,
	setPerPage,
	setCurrentPage,
	searchResults,
	currentPage,
	setSelectedCoin,
}: {
	perPage: number;
	setPerPage: (value: number) => void;
	setCurrentPage: (value: number) => void;
	searchResults: CryptoCoin[];
	currentPage: number;
	setSelectedCoin: (coin: CryptoCoin) => void;
}) => {
	const [sort, setSort] = useState<Sort>({
		column: "market_cap",
		order: "desc",
	});

	const [sortedSearchResults, setSortedSearchResults] =
		useState<CryptoCoin[]>(searchResults);

	useEffect(() => {
		setSortedSearchResults(SortCryptoCoins({ sort, searchResults }));
	}, [sort, searchResults]);

	const handleSort = (column: Sort["column"]) => {
		setSort((prev) => ({
			column,
			order:
				prev.column === column && prev.order === "asc" ? "desc" : "asc",
		}));
	};

	return (
		<div className={styles.cryptoListContainer}>
			<TableContainer component={Paper}>
				<Table>
					<TableHead>
						<TableRow>
							{tableCoulmns.map((tableColumn, index) => {
								return (
									<TableCell
										key={index}
										onClick={() =>
											handleSort(tableColumn.name)
										}
									>
										<div className={styles.tabelCellInner}>
											<div>{tableColumn.displayName}</div>
											<SwapVertRounded
												className={styles.sortIcon}
											/>
										</div>
									</TableCell>
								);
							})}
						</TableRow>
					</TableHead>
					<TableBody>
						{sortedSearchResults
							.slice(
								(currentPage - 1) * perPage,
								currentPage * perPage
							)
							.map((coin) => (
								<TableRow key={coin.id}>
									<TableCell>{coin.cmc_rank}</TableCell>
									<TableCell>
										<div
											className={styles.coinNameContainer}
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
											<span className={styles.coinName}>
												{coin.name} ({coin.symbol})
											</span>
										</div>
									</TableCell>
									<TableCell>
										{formatNumberCompact(
											coin.price,
											coin.currency
										)}
									</TableCell>
									<TableCell>
										{formatNumberCompact(
											coin.market_cap,
											coin.currency
										)}
									</TableCell>
									<TableCell
										className={
											coin.percent_change_24h >= 0
												? styles.positiveChange
												: styles.negativeChange
										}
									>
										{coin.percent_change_24h.toFixed(2)}%
									</TableCell>
									<TableCell
										className={
											coin.percent_change_7d >= 0
												? styles.positiveChange
												: styles.negativeChange
										}
									>
										{coin.percent_change_7d.toFixed(2)}%
									</TableCell>
									<TableCell>
										{formatNumberCompact(
											coin.volume_24h,
											coin.currency
										)}
									</TableCell>
									<TableCell
										className={
											coin.volume_change_24h >= 0
												? styles.positiveChange
												: styles.negativeChange
										}
									>
										{coin.volume_change_24h.toFixed(2)}%
									</TableCell>
								</TableRow>
							))}
					</TableBody>
				</Table>
			</TableContainer>
			<div className={styles.paginationContainer}>
				<div className={styles.itemsPerPageLabel}>Items per page:</div>
				<Select
					value={perPage.toString()}
					onChange={(event: SelectChangeEvent) => {
						setPerPage(parseInt(event.target.value, 10));
						setCurrentPage(1);
					}}
					sx={{
						minWidth: 80,
						size: "small",
						"& .MuiSelect-select": {
							paddingY: "4px",
							paddingX: "8px",
						},
					}}
					size="small"
				>
					{[10, 20, 50].map((option) => (
						<MenuItem key={option} value={option}>
							{option}
						</MenuItem>
					))}
				</Select>
				<Pagination
					count={Math.ceil(searchResults?.length / perPage)}
					page={currentPage}
					onChange={(event, value) => {
						setCurrentPage(value);
					}}
					shape="rounded"
				/>
			</div>
		</div>
	);
};

export default CryptoList;
