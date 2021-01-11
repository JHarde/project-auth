import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import crypto from "crypto";
import bcrypt from "bcrypt";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/authAPI";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(bodyParser.json());

const User = mongoose.model("User", {
  name: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    maxlength: 25,
  },
  password: {
    type: String,
    required: true,
  },
  accessToken: {
    type: String,
    default: () => crypto.randomBytes(128).toString("hex"),
  },
});

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Hello world");
});

app.post("/users", async (req, res) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const { name, password } = req.body;
    const user = await new User({
      name,
      password: bcrypt.hashSync(password, salt),
    }).save();
    res.status(200).json({ userId: user._id, accessToken: user.accessToken });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.error,
      message: "Could not save user",
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
