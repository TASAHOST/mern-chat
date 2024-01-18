const express = require("express");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const User = require("./models/User");
const Message = require("./models/Message");
const ws = require("ws");
const fs = require("fs");
const { log } = require("console");

//เพื่อเรียกใช้ไฟล์ .env
dotenv.config();
const app = express();

app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(__dirname + "/uploads"));

//เชื่อมต่อกับ mongo
const MONGGO_URI = process.env.MONGGO_URI;
mongoose.connect(MONGGO_URI);

//ลองว่าเชื่อมต่อกับเซิฟเวอร์ได้ไหม
app.get("/", (req, res) => {
  res.send("<h1>This is a RESFUL");
});

//User Register
const salt = bcrypt.genSaltSync(10);
app.post("/register", async (req, res) => {
  const { username, password } = req.body; // สลายโครงสร้าง
  try {
    const userDoc = await User.create({
      username,
      password: bcrypt.hashSync(password, salt),
    });
    res.json(userDoc);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
});

//Login
const secret = process.env.SECRET;
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const userDoc = await User.findOne({ username }); //เอา username ไปหาข้อมูลจากฐานข้อมูล
  if (userDoc) {
    const isMatchedPassword = bcrypt.compareSync(password, userDoc.password); //เช็ค พาส ที่ได้จากฟอร์ม และในฐานข้อมูลว่าเหมือนกันไหม
    if (isMatchedPassword) {
      //logged in
      jwt.sign({ username, userId: userDoc._id }, secret, {}, (err, token) => {
        if (err) throw err;
        //save data in cookie
        res.cookie("token", token).json({
          userId: userDoc._id,
          username,
        });
      });
    } else {
      res.status(400).json("wrong credentials");
    }
  } else {
    res.status(400).json("user not found");
  }
});

app.post("/logout", (req, res) => {
  res.cookie("token", "").json("ok");
});

app.get("/profile", (req, res) => {
  const token = req.cookies?.token;
  if (token) {
    jwt.verify(token, secret, {}, (err, userData) => {
      if (err) throw err;
      res.json(userData);
    });
  } else {
    res.status(401).json("no token");
  }
});

//บอกว่าให้ฟังที่ PORTไหน โดยดึงมาจากไฟล์ env
const PORT = process.env.PORT;
const server = app.listen(PORT, () => {
  console.log("Server is" + PORT);
});
//web Socket Server
const wss = new ws.WebSocketServer({ server });

wss.on("connection", (connection, req) => {
  //เเจ้งเพื่อนๆว่าออนไลน์อยู่
  const notifyAboutOnlinePeople = () => {
    [...wss.clients].forEach((client) => {
      client.send(
        JSON.stringify({
          online: [...wss.clients].map((c) => ({
            userId: c.userId,
            username: c.username,
          })),
        })
      );
    });
  };
  connection.isAlive = true;

  connection.timer = setInterval(() => {
    connection.ping();
    connection.deadTimer = setTimeout(() => {
      connection.isAlive = false;
      clearInterval(connection.timer);
      connection.terminate();
      notifyAboutOnlinePeople();
      console.log("dead");
    }, 1000);
  }, 5000);
  connection.on("pong", () => {
    clearTimeout(connection.deadTimer);
  });

  //read username and id from cookie for this connection

  const cookies = req.headers.cookie;
  if (cookies) {
    const tokenCookieString = cookies
      .split(";")
      .find((str) => str.startsWith("token="));
    if (tokenCookieString) {
      //.split คือการเอาตัวที่อยู่หลักเครื่องหมายที่ใส่ไว้ในวงเล็บ
      const token = tokenCookieString.split("=")[1];
      if (token) {
        jwt.verify(token, secret, {}, (err, userData) => {
          if (err) throw err;
          const { userId, username } = userDoc;
          connection.userId = userId;
          connection.username = username;
        });
      }
    }
  }

  connection.on("message", async (message) => {
    const messageData = JSON.parse(message.toString());
    const { recipient, sender, text, file } = messageData;
    let filename = null;
    if (file) {
      //เอานามสกลุลเดิมมาเเล้วเอาชื่อหน้าทิ้งไป
      const parts = file.name.split(".");
      const ext = parts(parts.length - 1);
      //เก้บชื่อไฟล์ด้วยเวลา วันที่
      filename = Date.now() + "." + ext;
      //ไฟล์จะถูกเก็บใน upload
      // __dirname  คือการบอกตำแหน่งปัจจุบันที่ โปรเเกรมกำลังทำงานอยู่
      const path = __dirname + "/uploads" + filename;
      //เหตุผลที่ต้องเปลี่ยนชื่อไฟล์ใหม่ เพราะ ไม่ให้มันซ้ำ เพื่อกันการเขียนทับ บางที่ การอัพชื่อซ้ำมันจะงงว่าต้องเก็บอันไหนไว้
      const bufferData = new Buffer(file, data.split(",")[1], "base64");
      fs.writeFile(path, bufferData, () => {
        console.log("file saved" + path);
      });
    }
    if (recipient && (text || file)) {
      const messageDoc = await Message.create({
        sender: connection.userId,
        recipient,
        text,
        file: file ? filename : null,
      });
      [...wss.clients]
        .filter((c) => c.userId === recipient)
        .forEach((c) =>
          c.send(
            JSON.stringify({
              sender: connection.userId,
              recipient,
              text,
              file: file ? filename : null,
              _id: messageData._id,
            })
          )
        );
    }
  });

  notifyAboutOnlinePeople();
});
