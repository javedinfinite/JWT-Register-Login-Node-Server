const DbConnection = require("./dbConnection")

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
            text: 'Insert into hackers(name, user_name, password, user_type) VALUES($1, $2, $3, $4)',
            values: [data.name, data.user_name, data.password, data.user_type],
          }
        const res = await client.query(query);
        
        client.release()
        return true
            
    } catch (err){
            console.log(err)
        }
}


module.exports = {
    register_hacker:register_hacker
}