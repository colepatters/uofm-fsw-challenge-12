const pg = require('pg')
const { Client } = pg
const client = new Client()
require('dotenv/config')

function getDb() {
    client.connect()
    .then(() => {
        return client
    })
    .catch(() => {
        console.errorr('could not connect to db')
    })
}

module.exports = getDb