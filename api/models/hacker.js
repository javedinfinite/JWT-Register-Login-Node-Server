const DbConnection = require("./dbConnection")

get_all_hackers = async() => {
    try{
        const client = await DbConnection.get_db_connection()
        const sql_text = 'SELECT id,name,user_name,user_type,avatar FROM public.hackers';
        const res = await client.query(sql_text);
        client.release()
        return res.rows
            
    } catch (err){
            console.log(err)
        }
}

get_hackers_count = async() => {
    try{
        const client = await DbConnection.get_db_connection()
        const sql_text = 'select COUNT(*) from public.hackers';
        const res = await client.query(sql_text);
        client.release()
        return res.rows[0].count
            
    } catch (err){
            console.log(err)
        }
}

get_hackers_by_page_num = async(pageNumber) => {
    try{
        const client = await DbConnection.get_db_connection()
        const pageSize = 10
        offset = (pageNumber - 1)*pageSize //this will dertmine after how many number of rows we need to start taking 10 data
        const sql_text = 'select id,name,user_name,user_type,avatar from public.hackers order by id offset $1 rows fetch next $2 rows only';
        const res = await client.query(sql_text,[offset,pageSize]);

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
            var top_id_list = []
            const sql_text = 'select * from public.hacker_details   order by overall_rank desc limit $1';
            const res = await client.query(sql_text,[id]);
            if(res.rows.length==0){
                client.release()
                return []
            }
            else{

                for (let item of res.rows) {
                    top_id_list.push(item.id);
                }
            }
            const sql_text2 = 'SELECT id,name,user_name,user_type,avatar FROM  public.hackers where id in ('+top_id_list+')';   
            const res2 = await client.query(sql_text2 );
            client.release()
            return res2.rows                 
            
    } catch (err){
            console.log("error from final catch",err)
        }
}

module.exports = {
    get_all_hackers:get_all_hackers,
    get_hacker_details,
    get_top_n_hackers,
    get_hackers_count,
    get_hackers_by_page_num
}

