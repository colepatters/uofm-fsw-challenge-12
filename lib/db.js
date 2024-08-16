const pg = require("pg")
const { Client } = pg
require("dotenv/config")

let client;

async function getDb() {
    if (!client) {
        client = new Client({
            connectionString: process.env.PG_URL
        })
        await client.connect()
    }

    return client    
}

module.exports = getDb
