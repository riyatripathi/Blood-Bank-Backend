require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors({origin: true}));
const bodyParser = require('body-parser');
app.use(bodyParser.json());

require('./database/db.js');

app.get('/',(req,res)=>{
	console.log(req);
	res.send({status:200});
})

app.get('/search',async (req,res)=>{
	let result = [];
	result = await searchuser(req.query);
	console.log(result);
	res.send(result);
})

app.post('/add',async (req,res)=>{
	let auth = await authenticate(req.body.email,req.body.mobile);
	console.log(auth);
	if(auth.status == 404){
		res.send(auth);
	}else{
		let statusCheck = await adddonar(req.body);
		res.send(statusCheck);
	}
})

app.get('/states',(req,res)=>{
	res.sendFile(__dirname+'/states.json');
})

app.listen(process.env.PORT || 5000);
