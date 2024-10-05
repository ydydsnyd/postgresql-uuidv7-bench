import { nanoid } from "nanoid";
import crypto from "node:crypto";
import { Snowflake } from "nodejs-snowflake";
import { uuidv7 } from "uuidv7";
import type { BenchModel } from "./type";

const serialBenchModel: BenchModel = {
	name: "serial",
	dropAndCreateTableQuery: () => {
		return `
            DROP TABLE IF EXISTS serial_table;
            CREATE TABLE IF NOT EXISTS serial_table (
                id SERIAL PRIMARY KEY
            );
        `;
	},
	bulkInsertQuery: (count: number) => {
		const values = Array(count).fill("(DEFAULT)").join(", ");
		return `INSERT INTO serial_table (id) VALUES ${values};`;
	},
};

const serialWithRandomBenchModel: BenchModel = {
	name: "serial_with_random",
	dropAndCreateTableQuery: () => {
		return `
            DROP TABLE IF EXISTS serial_with_random_table;
            CREATE TABLE IF NOT EXISTS serial_with_random_table (
                id SERIAL PRIMARY KEY,
                random VARCHAR(21) NOT NULL UNIQUE
            );
        `;
	},
	bulkInsertQuery: (count: number) => {
		const values: string[] = [];
		for (let i = 0; i < count; i++) {
			const random = nanoid();
			values.push(`('${random}')`);
		}
		return `INSERT INTO serial_with_random_table (random) VALUES ${values.join(", ")};`;
	},
};

const uuidv4BenchModel: BenchModel = {
	name: "uuidv4",
	dropAndCreateTableQuery: () => {
		return `
            DROP TABLE IF EXISTS uuidv4_table;
            CREATE TABLE IF NOT EXISTS uuidv4_table (
                id UUID PRIMARY KEY
            );
        `;
	},
	bulkInsertQuery: (count: number) => {
		const values: string[] = [];
		for (let i = 0; i < count; i++) {
			const random = crypto.randomUUID();
			values.push(`('${random}')`);
		}
		return `INSERT INTO uuidv4_table (id) VALUES ${values.join(", ")};`;
	},
};

const uuidv4WithCreatedAtBenchModel: BenchModel = {
	name: "uuidv4_with_created_at",
	dropAndCreateTableQuery: () => {
		return `
            DROP TABLE IF EXISTS uuidv4_with_created_at_table;
            CREATE TABLE IF NOT EXISTS uuidv4_with_created_at_table (
                id UUID PRIMARY KEY,
                created_at TIMESTAMP NOT NULL
            );
            CREATE INDEX ON uuidv4_with_created_at_table (created_at);
        `;
	},
	bulkInsertQuery: (count: number) => {
		const values: string[] = [];
		for (let i = 0; i < count; i++) {
			const id = crypto.randomUUID();
			const now = new Date().toISOString();
			values.push(`('${id}', '${now}')`);
		}
		return `INSERT INTO uuidv4_with_created_at_table (id, created_at) VALUES ${values.join(", ")};`;
	},
};

const uuidv7BenchModel: BenchModel = {
	name: "uuidv7",
	dropAndCreateTableQuery: () => {
		return `
            DROP TABLE IF EXISTS uuidv7_table;
            CREATE TABLE IF NOT EXISTS uuidv7_table (
                id UUID PRIMARY KEY
            );
        `;
	},
	bulkInsertQuery: (count: number) => {
		const values: string[] = [];
		for (let i = 0; i < count; i++) {
			const id = uuidv7();
			values.push(`('${id}')`);
		}
		return `INSERT INTO uuidv7_table (id) VALUES ${values.join(", ")};`;
	},
};

const snowflakeBenchModel: BenchModel = {
	name: "snowflake",
	dropAndCreateTableQuery: () => {
		return `
            DROP TABLE IF EXISTS snowflake_table;
            CREATE TABLE IF NOT EXISTS snowflake_table (
                id BIGINT PRIMARY KEY
            );
        `;
	},
	bulkInsertQuery: (count: number) => {
		const values: string[] = [];
		const snowflake = new Snowflake();
		for (let i = 0; i < count; i++) {
			const id = snowflake.getUniqueID();
			values.push(`(${id})`);
		}
		return `INSERT INTO snowflake_table (id) VALUES ${values.join(", ")};`;
	},
};

export const benchModelSet1 = [
	serialBenchModel,
	serialWithRandomBenchModel,
	uuidv4BenchModel,
	uuidv4WithCreatedAtBenchModel,
	uuidv7BenchModel,
	snowflakeBenchModel,
];
