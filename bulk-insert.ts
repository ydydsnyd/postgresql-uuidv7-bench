import { uuidv7 } from 'uuidv7';
import crypto from 'crypto'

export async function bulkInsertUuidv7Query(count: number) {
    let query = '';

    for (let i = 0; i < count; i++) {
        const id = uuidv7()
        query += `INSERT INTO uuidv7_table (id) VALUES ('${id}');`
    }
    return query
}

export async function bulkInsertUuidv4Query(count: number) {
    let query = '';
    for (let i = 0; i < count; i++) {
        const random = crypto.randomUUID()
        query += `INSERT INTO uuidv4_table (id) VALUES ('${random}');`
    }
    return query
}

export async function bulkInsertSerialWithRandomQuery(count: number) {
    let query = '';
    for (let i = 0; i < count; i++) {
        const random = crypto.randomBytes(21).toString('hex').slice(0, 21)
        query += `INSERT INTO serial_with_random_table (random) VALUES ('${random}');`
    }
    return query
}

export async function bulkInsertSerialQuery(count: number) {
    let query = '';
    for (let i = 0; i < count; i++) {
        query += `INSERT INTO serial_table DEFAULT VALUES;`
    }
    return query
}
