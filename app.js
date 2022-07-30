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
	let result;
	if(req.query.bloodGroup == 1){
		result = await getByBloodGrp("AB+");
	}else if(req.query.bloodGroup == 2){
		result = await getByBloodGrp("AB-");
	}else if(req.query.bloodGroup == 3){
		result = await getByBloodGrp("O+");
	}else if(req.query.bloodGroup == 4){
		result = await getByBloodGrp("O-");
	}else if(req.query.bloodGroup == 5){
		result = await getByBloodGrp("B+");
	}else if(req.query.bloodGroup == 6){
		result = await getByBloodGrp("B-");
	}else if(req.query.bloodGroup == 7){
		result = await getByBloodGrp("A+");
	}else if(req.query.bloodGroup == 8){
		result = await getByBloodGrp("A-");
	}
	res.send(result);
})

app.post('/add',(req,res)=>{
	console.log("in app.js: ",req.body);
	adddonar(req.body);
	res.send("status:200");
})

app.get('/states',(req,res)=>{
	res.sendFile(__dirname+'/states.json');
})

app.listen(8000);
