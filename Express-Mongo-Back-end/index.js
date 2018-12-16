const express = require('express');
const bodyParser = require("body-parser");
const app = express();
const cors = require('cors');


app.use(cors());
app.use(bodyParser.json()); // accept JSON data
app.use(bodyParser.urlencoded({ extended: true })); // accept form data


// use socket.io
const http = require('http').createServer(app);  
const io = require('socket.io')(http);

const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");
// Connection URL
const url = "mongodb://localhost:27017";
// Database Name
const userDatabase = "userDatabase";
const chatMessageDatabase = "chatMessageDatabase";

app.get('/', (req, res) => res.send('Hello World!'));


var userFound = null;

app.post('/api/create/user',function(req,res){
    console.log(req.body);
    username = req.body.username;
    password = req.body.password;

    userFound = null

    data = {username : username, password: password};

    const findUser = function(db, data, callback) {
        const collection = db.collection("documents");
        collection.find( { username : data.username } ).toArray(function(err, docs) {
          assert.equal(err, null);
          console.log("Found the following records: " + docs.length);
          console.log(docs);
          userFound = docs
          callback(docs);
        });
    };

    MongoClient.connect(url,function(err, client) {
        assert.equal(null, err);
        console.log("Connected successfully to server");
        const db = client.db(userDatabase);

        findUser(db,data,function(){
            if(userFound.length == 0){
                const insertUser = function(db,data, callback) {
                    let username = data.username;
                    let password = data.password;
                    const collection = db.collection('documents');
                    collection.insertMany([
                        {
                            username: username,
                            password: password
                        }
                    ], function(err, result) {
                        console.log(err);
                        assert.equal(err, null);
                        assert.equal(1, result.ops.length);
                        console.log("Inserted 1 message into the collection");
                        callback(result);
                    });
                }
                console.log("No User found "+userFound)
              if(data.username.length !=0 && data.password.length !=0 ){
                  console.log("Data is Valid: "+ data);
                  insertUser(db,data,function(){
                      res.status(200).send( username );
                      client.close();
                  })
              }
            else{
                res.status(401).send( 'Input is invalid.' );
                client.close();
            }
          }
        // If user is found 
        else{
          res.status(400).send('User already exists!');
          client.close();
         }
        });
        
        client.close();
    });
    // res.send("Hello World!")
});


// app.post('/api/create/user',function(req,res){
//   console.log(req.body);
//   username = req.body.username;
//   password = req.body.username;

//   userFound = null

//   data = {username : username, password: password};
  // Use connect method to connect to the server
//   MongoClient.connect(url,function(err, client) {
//     assert.equal(null, err);
//     console.log("Connected successfully to server");
    
//     const db = client.db(userDatabase);
    
//     findUser(db,data,function(){
//         // If no user is found 
//         if(userFound.length == 0){
//               console.log("No User found "+userFound)
//             if(data.username.length !=0 && data.password.length !=0 ){
//                 console.log("Data is Valid: "+ data);
//                 insertUser(db,data,function(){
//                     res.status(200).send( username );
//                 })
//             }
//           else{
//               res.status(401).send( 'Input is invalid.' );
//           }
//         }
//       // If user is found 
//       else{
//         res.status(400).send('User already exists!');
//       }
//     });
//     client.close();
//   });


//   res.send("Hello World!")

// })

http.listen(3000);