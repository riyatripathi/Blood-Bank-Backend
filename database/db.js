const mysql = require('mysql');
require('dotenv').config();
const con = mysql.createConnection({
	user : process.env.user,
	password : process.env.password,
	host : process.env.host,
	database : process.env.database
});

con.connect((err)=>{
	if(err) throw err;
	else console.log('connects');
})

adddonar = (data)=>{
	console.log('data in db: ',data);
	con.query(`insert into donars set ?`,data,(error,result,fields)=>{
		if(error) throw error;
		else return result;
	})
}

getByBloodGrp = (blood)=>{
	return new Promise((resolve,reject)=>{
		con.query(`SELECT * FROM donars WHERE BloodGroup LIKE '${blood}'`,(error,result,fields)=>{
			if(error) reject(error);
			else resolve(result);
		})
	})
}

