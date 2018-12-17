const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(bodyParser.json()); // accept JSON data
app.use(bodyParser.urlencoded({ extended: true })); // accept form data

// use socket.io
const http = require("http").createServer(app);
const io = require("socket.io")(http);

const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");
// Connection URL
const url = "mongodb://localhost:27017";
// Database Name
const userDatabase = "userDatabase";
const chatMessageDatabase = "chatMessageDatabase";

app.get("/", (req, res) => res.send("Hello World!"));

var userFound = null;

const findUser = function(db, query, callback) {
  const collection = db.collection("documents");
  collection.find(query).toArray(function(err, docs) {
    assert.equal(err, null);
    console.log("Found the following records: " + docs.length);
    console.log(docs);
    userFound = docs;
    callback(docs);
  });
};

app.post("/api/create/user", function(req, res) {
  console.log(req.body);
  username = req.body.username;
  password = req.body.password;

  userFound = null;
  data = { username: username, password: password };
  if (data.username.length == 0 || data.password.length == 0) {
    res.status(401).send("Empty input is invalid.");
  } else {
    MongoClient.connect(
      url,
      function(err, client) {
        assert.equal(null, err);
        console.log("Connected successfully to server");

        const db = client.db(userDatabase);
        let query = { username: data.username };
        findUser(db, query, function() {
          if (userFound.length == 0) {
            // create new user
            const insertUser = function(db, data, callback) {
              // Get the documents collection
              const collection = db.collection("documents");
              // Insert some documents
              collection.insertMany(
                [{ username: data.username, password: data.password }],
                function(err, result) {
                  assert.equal(err, null);
                  assert.equal(1, result.ops.length);
                  console.log("Inserted 1 message into the collection");
                  callback(result);
                }
              );
            };

            // insertUser
            insertUser(db, data, function() {
              res.status(200).send(username);
            });
          } else {
            res.status(401).send("User already exists.");
          }
          client.close();
        });
      }
    );
  }
});

app.post("/api/login/user", function(req, res) {
  console.log(req.body);
  username = req.body.username;
  password = req.body.password;

  userFound = null;
  data = { username: username, password: password };

  if (data.username.length == 0 || data.password.length == 0) {
    res.status(401).send("Empty input is invalid.");
  } else {
    MongoClient.connect(
      url,
      function(err, client) {
        assert.equal(null, err);
        console.log("Connected successfully to server");

        const db = client.db(userDatabase);
        let query = { username: data.username };
        findUser(db, query, function() {
          if (userFound.length != 0) {
            // create new user
            if (
              userFound[0].username == username &&
              userFound[0].password == password
            ) {
              res.status(200).send(userFound[0].username);
            } else {
              res.status(401).send("Invalid Credentials.");
            }
          } else {
            res.status(401).send("User does not exist.");
          }
          client.close();
        });
      }
    );
  }
});

app.get("/api/all/users", function(req, res) {
  MongoClient.connect(
    url,
    function(err, client) {
      assert.equal(null, err);
      console.log("Connected successfully to server");

      const db = client.db(userDatabase);

      let query = {};
      findUser(db, query, function() {
        if (userFound.length != 0) {
          res.status(200).send(userFound);
        } else {
          res.status(401).send("User does not exist.");
        }
        client.close();
      });
    }
  );
});

http.listen(3000);