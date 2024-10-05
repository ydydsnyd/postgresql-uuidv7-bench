export interface BenchModel {
	name: string;
	dropAndCreateTableQuery: () => string;
	bulkInsertQuery: (count: number) => string;
}
