import client from './PgController.js';

await client.connect();

let sql = 'SELECT * FROM documents';

const { rows } = await client.query(sql);

console.log(rows);