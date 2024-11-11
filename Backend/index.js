require("dotenv").config();

const config = require("./config.json");
const mongoose = require("mongoose");

mongoose.connect(config.connectionString);

const User = require("./models/user.model");
const Note = require("./models/note.model");

const express = require("express");
const cors = require("cors");
const app = express();

const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./utilities");

app.use(express.json());

app.use(
  cors({
    origin: "*",
  })
);

app.get("/", (req, res) => {
  res.json({ data: "start" });
});

//Backend Ready

//Creat Account
app.post("/creat-account", async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName) {
    return res
      .status(400)
      .json({ error: true, message: "Full Name is required" });
  }
  if (!email) {
    return res.status(400).json({ error: true, message: "Email is required" });
  }

  if (!password) {
    return res
      .status(400)
      .json({ error: true, message: "Password is required" });
  }

  const isUser = await User.findOne({ email: email });

  if (isUser) {
    return res.json({
      error: true,
      message: "User Already Exist",
    });
  }
  const user = new User({
    fullName,
    email,
    password,
  });
  await user.save();

  const accessToken = jwt.sign({ user }, process.env.ACCESS_SECRET_TOKEN, {
    expiresIn: "36000m",
  });

  return res.json({
    error: false,
    user,
    accessToken,
    message: "Registration Successful",
  });
});

//Login 

app.post("/login", async (req, res) => {
  
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is Required" });
  }

  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }

  const userInfo = await User.findOne({ email: email });

  if (!userInfo) {
    return res.status(400).json({ message: "User not found" });
  }

  if (userInfo.email == email && userInfo.password == password) {
    const user = { user: userInfo };
    const accessToken = jwt.sign(user, process.env.ACCESS_SECRET_TOKEN, {
      expiresIn: "36000m",
    });

    return res.json({
      error: false,
      message: "Login successful",
      email,
      accessToken,
    });
  } else {
    return res.status(400).json({
      error: true,
      message: "Invalid Credentials",
    });
  }
});

//Get User
app.get("/get-user",authenticateToken , async (req , res) => {

  const { user } = req.user;

  const isUser = await User.findOne({_id:user._id});

  if (!isUser) {
    return res.sendStatus(401);
  }
  return res.json({
    user: {fullName :isUser.fullName , email:isUser.email , _id : isUser._id , createsOn : isUser.createsOn},
    message:"User fetch successfully",
  })
});

app.get("/get-all-user",authenticateToken , async (req , res) => {



  const users = await User.find({});

  if (!users) {
    return res.sendStatus(401);
  }
  return res.json({
    error: false,
    users,
    message: "All users retrieved successfully",
  });
  // return res.json({
  //   user: {fullName :isUser.fullName , email:isUser.email , _id : isUser._id , createsOn : isUser.createsOn},
  //   message:"User fetch successfully",
  // })
});

//Add Notes
app.post("/add-note", authenticateToken, async (req, res) => {
  const { title, content, tags } = req.body;
  const { user } = req.user;

  // console.log("user",  req.user);

  if (!title) {
    return res.status(400).json({ error: true, message: "title is required" });
  }
  if (!content) {
    return res
      .status(400)
      .json({ error: true, message: "content is required" });
  }

  try {
    const note = new Note({
      title,
      content,
      tags: tags || [],
      userID: user._id,
    });

    await note.save();

    return res.json({
      error: false,
      note,
      message: "Note added successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});

//Edit Notes
app.put("/edit-note/:noteId", authenticateToken, async (req, res) => {
  const noteId = req.params.noteId;
  const { title, content, tags, isPinned } = req.body;
  const { user } = req.user;

  if (!title && !content && !tags) {
    return res
      .status(404)
      .json({ error: true, message: "No changes provided" });
  }
  try {
    const note = await Note.findOne({ _id: noteId });
    if (!note) {
      return res.status(400).json({ error: true, message: "Note not found" });
    }

    if (title) note.title = title;
    if (content) note.content = content;
    if (tags) note.tags = tags;
    if (isPinned) note.isPinned = isPinned;

    await note.save();

    return res.json({
      error: false,
      note,
      message: "Note updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal server Error",
    });
  }
});

//Get all Notes
app.get("/get-all-notes/", authenticateToken, async (req, res) => {
  const { user } = req.user;
  try {
    const notes = await Note.find();
    // .sort({isPinned:-1})

    return res.json({
      error: false,
      notes,
      message: "All notes retrieved successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
});

//Delete Notes
app.delete("/delete-note/:noteId", authenticateToken, async (req, res) => {
const noteId = req.params.noteId;
const { user }= req.user;

try {
  const note = await Note.findOne({_id:noteId,userID:user._id});

  if(!note){
    return res
    .status(404)
    .json({
      error:true,
      message:"Note not found",
    });
    } 
    
    await Note.deleteOne({_id:noteId,userID:user._id})

    return res.json({
      error:false,
      message:"Note deleted successfully"
    });
  }
  catch (error) {
    return res.status(500).json({
      error:true,
      message:"Internal server error",
    })
  }
});

//Update isPinned value
app.put("/update-note/:noteId",authenticateToken, async (req , res) =>{
  const noteId = req.params.noteId;
  const { isPinned } = req.body;
  const { user } = req.user;

  try {
    const note = await Note.findOne({});
    if (!note) {
      return res.status(400).json({ error: true, message: "Note not found" });
    }

  note.isPinned = isPinned;

    await note.save();

    return res.json({
      error: false,
      note,
      message: "Note updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal server Error",
    });
  }
});

//Search notes
app.get("/search-note",authenticateToken, async (req , res) =>{
  const { user } = req.user;  
  const { query } = req.query;

  console.log("ffff",query,user);
  
    

    if (!query) {
      return res
      .status(400)
      .json({error :true , message:"search query is required"})
    }


    try {
    const matchingNotes = await Note.find({
       //userID: user._id,
      $or: [
        {title: {$regex: new RegExp(query,"i")}},
        {content: {$regex: new RegExp(query,"i") }},
      ]
    })

    // const matchingNotes = await Note.find({})
    console.log("matchingNotes",matchingNotes);

    return res.json({
      error:false,
      notes:matchingNotes,
      message:"Note matching the search query retrieved Successfully"
    });


    }catch (error) {
      console.error(error);
      return res.status(404).json
      ({error:true , message : "Internal server error"})
    }

})

app.listen(8000);

module.exports = app;