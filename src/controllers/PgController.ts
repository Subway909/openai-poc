import pg from 'pg';
import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand'

let myEnv = dotenv.config();
dotenvExpand.expand(myEnv);

const database_url = process.env.DATABASE_URL;
console.log(database_url);

const { Pool } = pg;

let client = new pg.Client(database_url);

client.connect((err) => {
  if (err) {
    console.error('connection error', err.stack)
  } else {
    console.log('connected')
  }
})

export default client;

// export default new Pool ({
//   max: 20,
//   connectionString: database_url,
//   idleTimeoutMillis: 30000
// });