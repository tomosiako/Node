const mysql =require('mysql');
const express =require ('express');
const app = express();
const session = require('express-session');
app.set('view engine','ejs');


app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));


app.use(express.urlencoded({extended:true}));
//OR
// app.use(express.json());

//app.get('/',(req,res)=>{
 //   res.redirect('/index')
//})
app.get('/',(req,res)=>{
   res.render('index')
})
app.get('/register',(req,res)=>{
    res.render('register');
 })
 app.get('/login',(req,res)=>{
    res.render('login');
 })
 app.get('/welcome',(req,res)=>{
    if (req.session.loggedIn) {
        res.render('welcome');
    } else {
        res.render('login') ;
    }
   
 })
 app.get('/update',(req,res)=>{
    if (req.session.loggedIn) {
        res.render('update');
    } else {
        res.render('login');
    }

 })
 app.get('/delete',(req,res)=>{
    if (req.session.loggedIn) {
        res.render('delete');
    } else {
        res.redirect('/login');
    }
    
 })

const db = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'nodejs_login'
})

db.connect((error)=>{
    if(error){
        console.log("database failed to connect");
    }else{
        console.log('database connected succesfully')
    }
})


app.post('/register',(req,res)=>{
var name=req.body.name
var email=req.body.email
var password=req.body.password

//db.query('INSERT INTO users ( name,email,password ) VALUES ( username,email,password)');
 //   res.end();
 db.query('insert into users set?',{name:name,email:email,password:password},(error,results)=>{
    if(error){
        console.log(error);
    }else{
        return  res.render('login')
    }
 })
})

// db.end((error)=>{
//     if(error){
//         console.log('error in closing the database'+error);
//     }else{
//         console.log('database connection closed successfully')
//     }
//})

app.post('/login',(req,res)=>{
   var username=req.body.name
   var password=req.body.password
   
   db.query('SELECT*FROM users where name=? and password=?',[username,password],(error,results)=>{
    if(error){
        console.log("login error"+error)
    }
    if(results.length>0){
        req.session.loggedIn = true; // Set session variable to indicate user is logged in
        res.redirect('/welcome'); // Redirect to welcome page or any other authenticated page
    }else{
        console.log('wrong credential details');
        res.render('login');
    }
   });
})

app.post('/delete',(req,res)=>{
    username=req.body.name

    db.query('DELETE * FROM users WHERE name=?',[username],(results,error)=>{
        if(error){
            console.log("could not delete something went wrong "+error)
        }else{
            console.log("deleted successfully");
            res.render('delete')
        }
    })
    

})

// app.get('/update', (req, res) => {
//     // Assuming you have logic to fetch user data from the server
//     const user = {
//         email: 'user@example.com', // Example email
//         username: 'exampleUser' // Example username
//     };

//     res.render('update', { user });
//});


app.post('/update',(req,res)=>{
    
        var username = req.body.name;
        var email=req.body.email
        var password = req.body.password;
        db.query('UPDATE users SET name = ?,email = ?, password = ? WHERE name = ?', [username, email, password, username], (error, results) => {
    
     
                   if (error) {
              console.error(error);
              return res.status(500).send('Internal Server Error');
           }
     
           if (results.affectedRows > 0) {
              res.send('Password updated successfully');
           } else {
              res.status(404).send('User not found');
           }
        });
     });
     



app.listen(3000,(error)=>{
    if(error){
        console.log('something went wrong server could not connect');
    }else{
        console.log('server connected successfully');
    }
})