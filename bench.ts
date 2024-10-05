import { writeFileSync } from "node:fs";
import { Client } from "pg";
import { benchModelSet2 } from "./benchModelSet2";

const createClient = () =>
	new Client({
		host: "localhost",
		port: 5432,
		user: "postgres",
		password: "postgres",
		database: "postgres",
	});
async function initializeDatabase() {
	const benchModels = benchModelSet2;

	const csvHeader = `Count,${benchModels.map((benchModel) => benchModel.name).join(",")}`;

	const step = 1000000; // 100万件
	const iteration = 30;

	const client = createClient();
	await client.connect();
	await Promise.all(
		benchModels.map((benchModel) =>
			client.query(benchModel.dropAndCreateTableQuery()),
		),
	);
	await client.end();

	let output = `${csvHeader}\n`;
	console.log(output);
	for (let i = 0; i < iteration; i++) {
		const durations: number[] = [];

		// 計測
		for (const benchModel of benchModels) {
			const client = createClient();
			await client.connect();

			const query = benchModel.bulkInsertQuery(step);
			const start = Date.now();
			// explain
			await client.query(query);
			const end = Date.now();
			const duration = end - start;
			durations.push(duration);

			await client.end();
		}

		// CSV出力
		const totalCount = (i + 1) * step;
		const csvData = `${totalCount},${durations.join(",")}\n`;
		output += csvData;

		console.log(csvData);
	}

	writeFileSync("insert_times.csv", output);
}

initializeDatabase();
