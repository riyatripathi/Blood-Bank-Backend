const mysql = require('mysql');
require('dotenv').config();
const db = mysql.createConnection({
	user : process.env.user,
	password : process.env.password,
	host : process.env.host,
	database : process.env.database,
	port : process.env.db_port
});

db.connect((err)=>{
	if(err) throw err;
	else console.log('Database Connected');
})

authenticate = (email,mobile)=>{
	const query1 = `SELECT count(*) as count FROM users WHERE mobile = ${mobile}`;
	const query2 = `SELECT count(*) as count FROM users WHERE email = '${email}'`;
	return new Promise((resolve,reject)=>{
		db.query(query1,(error,result,fields)=>{
			if(error) resolve({status:404,message:"Internal Server Error"});
			if(result[0].count == 0){
				db.query(query2,(error2,result2,fields2)=>{
					if(error2) resolve({status:404,message:"Internal Server Error"});
					console.log(result2);
					if(result2[0].count == 0){
						resolve({status:200});
					}else{
						resolve({status:404,message:"Email Already Exists"});
					}
				})
			}else{
				resolve({status:404,message:"Mobile Number Already Exists"});
			}
		})
	})

}

adddonar = (data)=>{
	const name = data.name;
	const email = data.email;
	const mobile = data.mobile;
	const state = data.state;
	const district = data.district;
	const blood = data.blood;
	const gender = data.gender;
	const age = data.age;
	const query1 = `INSERT INTO users SET ?`;
	const data1 = {
		name : name,
		email : email,
		mobile : mobile,
		registration_date_time : new Date()
	};

	return new Promise(function(resolve,reject){
		db.query(query1,data1,(error,result,fields)=>{
			if(error) resolve({status:404});
			if(result.affectedRows == 1){
				const data2 = {
					id : result.insertId,
					state : state,
					district : district
				};
				db.query(`INSERT INTO user_address SET ?`,data2,(error2,result2,fields2)=>{
					if(error2){
						resolve({status : 404,message:"Internal Server Error"});
					}else{
						if(result2.affectedRows == 1){
							const data3 = {
								id : result.insertId,
								age : age,
								gender : gender,
								blood_group : blood
							}
							db.query(`INSERT INTO user_details SET ? `,data3,(error3,result3,fields3)=>{
								if(error3){
									resolve({status:404,message:"Internal Server Error"});
								}else{
									if(result3.affectedRows == 1){
										resolve({status:200,message:"User Registered Successfully"});
									}else{
										resolve({status:404,message:"Internal Server Error"});
									}
								}
							})
						}
					}
				})
			}else{
				resolve({status : 404, message : "Internal Server Error"});
			}
		})
	})
}

searchuser = (data)=>{
	// http://localhost:5000/search?state=3&dist=4&blood=1
	console.log(data);
	query = `SELECT 
			users.name,
			users.mobile,
			users.registration_date_time,
			user_address.state,
			user_address.district,
			user_details.age,
			user_details.blood_group 
			FROM users 
			JOIN user_address ON user_address.id = users.id 
			JOIN user_details ON user_details.id = users.id 
			WHERE user_address.state = ${data.state} 
			AND user_address.district = ${data.dist} 
			AND user_details.blood_group = ${data.blood};`
	return new Promise((resolve,reject)=>{
		db.query(query,(error,result,fields)=>{
			if(error) resolve({status : 200,message:"INTERNAL SERVER ERROR"});
			else resolve(result);
		})
	})
}

