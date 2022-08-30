const { Client, Pool } = require('pg');
const config = require("../../config/config")

db_config = config.get_db_config()

const pool = new Pool({
    user: db_config.user,
    host: db_config.host,
    database: db_config.database,
    password: db_config.password,
    port: db_config.port,
});

pool.on('error', (err, client) => {
    console.error('PoolError:', err);
});

get_db_connection = async () => {
    try{
        const client = await pool.connect();

        console.log("DB connection successfully established...")
        console.log("DB connected with user:", client.user)
        return client

    } catch (err){
        console.log(err)
    }
};

module.exports.get_db_connection = get_db_connection
 