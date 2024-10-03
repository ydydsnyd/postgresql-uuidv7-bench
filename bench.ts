import { createTables } from './create-tables';
import { bulkInsertUuidv7Query, bulkInsertSerialQuery, bulkInsertSerialWithRandomQuery, bulkInsertUuidv4Query } from './bulk-insert';
import { Client } from 'pg';
import { writeFileSync } from 'fs';

const createClient = () => new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'postgres',
    database: 'postgres',
})
async function initializeDatabase() {
    await createTables();

    const count = 1000000; // 100万件

    let output = 'Count,Serial(ms),SerialWithRandom(ms),UUIDv4(ms),UUIDv7(ms)\n';
    console.log(output)
    for (let i = 0; i < 30; i++) {
        const client = createClient()
        await client.connect();

        // Serialの挿入時間計測
        const startSerial = Date.now();
        await client.query(await bulkInsertSerialQuery(count));
        const endSerial = Date.now();
        const durationSerial = endSerial - startSerial;

        // SerialWithRandomの挿入時間計測
        const startSerialWithRandom = Date.now();
        await client.query(await bulkInsertSerialWithRandomQuery(count));
        const endSerialWithRandom = Date.now();
        const durationSerialWithRandom = endSerialWithRandom - startSerialWithRandom;

        // UUIDv4の挿入時間計測
        const startUuidv4 = Date.now();
        await client.query(await bulkInsertUuidv4Query(count));
        const endUuidv4 = Date.now();
        const durationUuidv4 = endUuidv4 - startUuidv4;

        // UUIDv7の挿入時間計測
        const startUuidv7 = Date.now();
        await client.query(await bulkInsertUuidv7Query(count));
        const endUuidv7 = Date.now();
        const durationUuidv7 = endUuidv7 - startUuidv7;

        // CSV出力
        const totalCount = (i + 1) * count;
        const csvData = `${totalCount},${durationSerial},${durationSerialWithRandom},${durationUuidv4},${durationUuidv7}\n`;
        output += csvData;

        console.log(csvData)

        await client.end();
    }

    writeFileSync('insert_times.csv', output);
}

initializeDatabase().catch(console.error);