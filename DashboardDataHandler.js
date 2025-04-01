const db = require("./database");

const GetTop100Data = ()=>{
    try{
        const stmt = db.prepare(
            "SELECT * FROM TRANSACTIONS ORDER BY ID DESC LIMIT 100;"
        );
        const data = stmt.all();
        return {success:true, data:data};
    }catch(e){
        alert(e);
        return {failure:true, data:e};
    }
}






module.exports = {
    GetTop100Data: GetTop100Data,
  };