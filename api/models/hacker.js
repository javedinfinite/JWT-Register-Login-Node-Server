const DbConnection = require("./dbConnection")

get_all_hackers = async() => {
    try{
        const client = await DbConnection.get_db_connection()
        const sql_text = 'SELECT * FROM public.hackers';
        const res = await client.query(sql_text);
        client.release()
        return res.rows
            
    } catch (err){
            console.log(err)
        }
}

get_hacker_details = async(id) => {
    try{
        const client = await DbConnection.get_db_connection()
            const sql_text = 'SELECT * FROM public.hacker_details where id= $1';
            const res = await client.query(sql_text,[id]);
            client.release()
            return res.rows                 
            
    } catch (err){
            console.log("error from final catch",err)
        }
}

get_top_n_hackers = async(id) => {
    try{
        const client = await DbConnection.get_db_connection()
            const sql_text = 'select * from public.hacker_details   order by overall_rank desc limit $1';
            const res = await client.query(sql_text,[id]);
            client.release()
            return res.rows                 
            
    } catch (err){
            console.log("error from final catch",err)
        }
}

module.exports = {
    get_all_hackers:get_all_hackers,
    get_hacker_details,
    get_top_n_hackers
}

