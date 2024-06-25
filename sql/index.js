const {Client} = require('pg');

const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: 'password',
});

client.connect()
client.query('SELECT * FROM users', (err, res) => {
    if (err)
        console.log(err, res)
    else
        console.log(res.rows)

    client.end()
})