const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");

var moment = require("moment");
moment().format("LLL");

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

// app.get("/", (req, res) => res.send("Hello World!"));

var foundResult = null;

const find = function(db, query, callback) {
  const collection = db.collection("documents");
  console.log(query);
  collection.find(query).toArray(function(err, docs) {
    assert.equal(err, null);
    console.log("Found the following records: " + docs.length);
    // console.log(docs);
    foundResult = docs;
    callback(docs);
  });
};

/** refactor  */

const insertMessage = function(db, data, callback) {
  const collection = db.collection("documents");
  console.log(data);

  collection.insertMany(data, function(err, result) {
    assert.equal(err, null);
    assert.equal(1, result.ops.length);
    console.log("Inserted 1 message into the collection");
    callback(result);
  });
};

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

app.post("/api/create/user", function(req, res) {
  console.log(req.body);
  username = req.body.username;
  password = req.body.password;

  foundResult = null;
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
        find(db, query, function() {
          if (foundResult.length == 0) {
            // insertUser
            insertUser(db, data, function() {
              res.status(200).send({ username: username });
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

  foundResult = null;
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

        find(db, query, function() {
          if (foundResult.length != 0) {
            // create new user
            if (
              foundResult[0].username == username &&
              foundResult[0].password == password
            ) {
              res.status(200).send({ username: username });
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
      find(db, query, function() {
        if (foundResult.length != 0) {
          res.status(200).send(foundResult);
        } else {
          res.status(401).send("Invalid Credentials.");
        }
        client.close();
      });
    }
  );
});

const findLast50Messages = function(db, query, callback) {
  const collection = db.collection("documents");
  console.log(query);
  collection
    .find(query)
    .limit(50)
    .toArray(function(err, docs) {
      assert.equal(err, null);
      console.log("Found the following records: " + docs.length);
      // console.log(docs);
      foundResult = docs;
      callback(docs);
    });
};

// io.on("connection", function(socket) {
//Creates a new message
app.post("/api/chat/new/message", function(req, res) {
  // use socket .io here
  let sender = req.body.sender;
  let receiver = req.body.receiver;
  let message = req.body.message;
  let timeStamp = moment(new Date()).toString();

  let senderFound = null;
  let receiverFound = null;

  let data = [
    {
      sender: sender,
      receiver: receiver,
      message: message,
      timeStamp: timeStamp
    }
  ];

  console.log(data);

  foundResult = null;

  if (sender != null && receiver != null && message.length != 0) {
    MongoClient.connect(
      url,
      function(err, client) {
        assert.equal(null, err);
        console.log("Connected successfully to server");

        const dbChat = client.db(chatMessageDatabase);
        const dbUser = client.db(userDatabase);

        let query = { username: receiver };

        find(dbUser, query, function() {
          receiverFound = foundResult;

          if (receiverFound.length != 0) {
            console.log(receiver);
            foundResult = null;
            query = { username: sender };
            find(dbUser, query, function() {
              senderFound = foundResult;
              if (senderFound.length != 0) {
                insertMessage(dbChat, data, function() {
                  res.status(200).send({ newMessage: data });
                  /**
                   * Socket.io
                   */
                  client.close();
                });
              } else {
                res.status(401).send("Invalid sender user.");
                client.close();
              }
              client.close();
            });
          } else {
            res.status(401).send("Invalid receiver user.");
            client.close();
          }
        });
      }
    );
  } else {
    res.status(401).send("Invalid Credentials.");
  }
});

// get this users last 50 messages
app.get("/api/chat/50/:username", function(req, res) {
  console.log(req.params.username);
  let getThisUser = req.params.username;

  foundResult = null;

  MongoClient.connect(
    url,
    function(err, client) {
      assert.equal(null, err);
      console.log("Connected successfully to server");

      const dbChat = client.db(chatMessageDatabase);
      const dbUser = client.db(userDatabase);

      let query = { username: getThisUser };
      let messagesFound = null;

      find(dbUser, query, function() {
        if (foundResult.length != 0) {
          foundResult = null;
          query = { $or: [{ receiver: getThisUser }, { sender: getThisUser }] };
          findLast50Messages(dbChat, query, function() {
            messagesFound = foundResult;
            if (messagesFound.length != 0) {
              messagesFound = messagesFound.sort({ timeStamp: -1 });
            }

            res.status(200).send(messagesFound);

            client.close();
          });
        } else {
          res.status(401).send("Invalid user.");
          client.close();
        }
      });
    }
  );
});

app.get("/api/chat/sent/received/:username", function(req, res) {
  console.log(req.params.username);
  let getThisUser = req.params.username;

  foundResult = null;
  let messageSender = null;
  let messageReceiver = null;

  MongoClient.connect(
    url,
    function(err, client) {
      assert.equal(null, err);
      console.log("Connected successfully to server");

      const dbChat = client.db(chatMessageDatabase);
      const dbUser = client.db(userDatabase);

      let query = { username: getThisUser };

      find(dbUser, query, function() {
        foundResult = null;
        query = { sender: getThisUser };
        find(dbChat, query, function() {
          messageSender = foundResult;
          if (messageSender.length != 0) {
            messageSender = messageSender.sort({ timeStamp: -1 });
          }
          query = { receiver: getThisUser };
          find(dbChat, query, function() {
            messageReceiver = foundResult;
            if (messageReceiver.length != 0) {
              messageReceiver = messageReceiver.sort({ timeStamp: -1 });
            }
            let data = [messageSender, messageReceiver];
            res.status(200).send(data);
            client.close();
          });
        });
      });
    }
  );
});

app.get("/api/chat/:username1/:username2", function(req, res) {
  console.log(req.params.username1);
  console.log(req.params.username2);

  let user1 = req.params.username1;
  let user2 = req.params.username2;

  MongoClient.connect(
    url,
    function(err, client) {
      assert.equal(null, err);
      console.log("Connected successfully to server");

      const dbChat = client.db(chatMessageDatabase);
      const dbUser = client.db(userDatabase);

      let query = { username: user1 };
      find(dbUser, query, function() {
        if (foundResult.length != 0) {
          foundResult = null;
          query = { username: user2 };
          find(dbUser, query, function() {
            if (foundResult.length != 0) {
              foundResult = null;
              query = {
                $or: [
                  {
                    $and: [{ receiver: user1 }, { sender: user2 }]
                  },
                  {
                    $and: [{ receiver: user2 }, { sender: user1 }]
                  }
                ]
              };
              find(dbChat, query, function() {
                let conversation = foundResult;
                console.log(conversation);
                if (foundResult.length != 0) {
                  conversation = conversation.sort({ timeStamp: -1 });
                }
                res.status(200).send(conversation);
                client.close();
              });
            } else {
              res.status(401).send("One user Does not exist.");
              client.close();
            }
          });
        } else {
          res.status(401).send("One user Does not exist.");
          client.close();
        }
      });
    }
  );
});

// });

http.listen(3000);
