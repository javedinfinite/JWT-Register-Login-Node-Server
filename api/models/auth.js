const DbConnection = require("./dbConnection")
var bcrypt = require('bcryptjs');

validate_user = async(user_name, password) => {
    console.log('user_name, password', user_name, password)

    try{
        const client = await DbConnection.get_db_connection()
        const query = {
            text: 'select * from  hackers where user_name =$1',
            values: [user_name],
          }
        const res = await client.query(query);
        client.release()
        if(res.rowCount==1){
            const user = res.rows[0]
            console.log('user', user);
            const match = await bcrypt.compare(password, user.password);
            if(match)
                return true
            else
                return false
        }
        else 
            return false
    } catch (err){
            console.log(err)
        }

}

is_username_exist = async(user_name, client) => {
    try{
        const query = {
            text: 'select * from  hackers where user_name =$1',
            values: [user_name],
          }
        const res = await client.query(query);
        if(res.rowCount==1)
          return true
        else 
            return false
    } catch (err){
            console.log(err)
        }

}

register_hacker = async(data) => {
    try{
        const client = await DbConnection.get_db_connection()
        if(await is_username_exist(data.user_name, client)){
            return false
        }
        const query = {
            text: 'Insert into hackers(name, user_name, password, user_type, avatar) VALUES($1, $2, $3, $4, $5)',
            values: [data.name, data.user_name, data.password, data.user_type, 'violet'],
          }
        const res = await client.query(query);

        //to fill user details table with dummy data, later on we can give feature to update the user
        const query2 = {
            text: `Insert into hacker_details(profile_link,location,education,challenges_solved,
                solutions_submitted,solutions_accepted,overall_rank,followers,following) VALUES($1, $2, $3, $4, $5,$6,$7,$8,$9)`,
            values: ['https://www.hackerearth.com/', 'Pamel', 'CSE',492, 458, 242, 63, 24, 6],
          }
        const res2 = await client.query(query2);
        
        client.release()
        return true
            
    } catch (err){
            console.log(err)
        }
}

get_one_hacker = async(user_name) => {
    try{
        const client = await DbConnection.get_db_connection()
            const sql_text = 'SELECT id,name,user_name,user_type,avatar FROM public.hackers where user_name= $1';
            const res = await client.query(sql_text,[user_name]);
            client.release()
            return res.rows[0]                 
            
    } catch (err){
            console.log("error from final catch",err)
        }
}


module.exports = {
    register_hacker:register_hacker,
    validate_user:validate_user,
    get_one_hacker
}