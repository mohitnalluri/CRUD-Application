const express = require('express');
const mysql = require('mysql');
const bodyParser= require('body-parser');
const app=express();
const port=3000;
//middleware
app.use(bodyParser.urlencoded({extended:true}));

//app.use(express.static(__dirname));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.use(express.static(__dirname, { index: 'index.html' }));
//serves static files^

//db connection
const db=mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'crud'
});

db.connect((err)=>{
    if(err) {
        console.error('Database Connection Failed: ' + err.stack);
        return;
    }
    console.log('Connected to Database');
});

app.post('/submit',(req,res)=>{
    const {id,name,gender,email,dob,file_path,address,district,state,country }=req.body;
//if there is post request to submit endpoint from form then it requests the data and gives a response back to client.

const sql = 'INSERT INTO form_details (id,name,gender,email,dob,file_path,address,district,state,country) VALUES (?,?,?,?,?,?,?,?,?,?)';

db.query(sql,[id,name,gender,email,dob,file_path,address,district,state,country], (err,result) => {
    if(err) {
        console.error('Error inserting data into database:',err);
        res.status(500).send('Internal Server Error');
        return;
    }
    console.log('Data Inserted into Database');
    res.status(200).send('Data submitted successfully');
});
});
//test
//data retrieval--getdata is endpoint
app.get('/getdata', (req,res) => {
    const sql = 'SELECT * FROM form_details';
    db.query(sql,(err,result) => {
        if(err){
            console.error('Error retrieving data from database:',err);
            res.status(500).send('Internal Server Error');
        return;
        }

        // send retrieved data as json to the client
        res.json(result); 
    });
});


//start server
app.listen(port, function () {
    console.log(`Server is running on port ${port}`);
});

