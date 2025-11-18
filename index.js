// Backend mongodb index.jsx file

const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// ---------------------
// CORS MIDDLEWARE FIX
// ---------------------
app.use(
  cors({
    origin: [
      "https://insta-sohor.web.app",
      "https://insta-sohor.firebaseapp.com",
      "*",
    ],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Content-Type, Authorization",
  })
);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.use(express.json());

// ---------------------
// MONGODB CONNECTION
// ---------------------
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9s9fb7y.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // await client.connect();

    const wishlistCollection = client.db("wishlistDB").collection("wishlist");

    const commentCollection = client.db("commentDB").collection("comment");

    const postsCollection = client.db("blogPostsDB").collection("allposts");

    // ---------------------
    // WISHLIST ROUTES
    // ---------------------

    app.get("/wishlist", async (req, res) => {
      const result = await wishlistCollection.find().toArray();
      res.send(result);
    });

    app.post("/wishlist", async (req, res) => {
      const result = await wishlistCollection.insertOne(req.body);
      res.send(result);
    });

    app.delete("/wishlist/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await wishlistCollection.deleteOne(query);
      res.send(result);
    });

    // ---------------------
    // BLOG POSTS ROUTES
    // ---------------------

    app.get("/allposts", async (req, res) => {
      const result = await postsCollection.find().toArray();
      res.send(result);
    });

    app.get("/allposts/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await postsCollection.findOne(query);
      res.send(result);
    });

    app.post("/allposts", async (req, res) => {
      const result = await postsCollection.insertOne(req.body);
      res.send(result);
    });

    app.delete("/allposts/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await postsCollection.deleteOne(query);
      res.send(result);
    });

    app.put("/allposts/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedPost = req.body;

      const post = {
        $set: {
          name: updatedPost.name,
          title: updatedPost.title,
          image: updatedPost.image,
          category: updatedPost.category,
          descriptionSummary: updatedPost.descriptionSummary,
          descriptionDetail: updatedPost.descriptionDetail,
          userPhotoURL: updatedPost.userPhotoURL,
          userEmail: updatedPost.userEmail,
          timestamp: updatedPost.timestamp,
        },
      };

      const result = await postsCollection.updateOne(filter, post, options);
      res.send(result);
    });

    // ---------------------
    // COMMENTS ROUTES
    // ---------------------

    app.get("/comment", async (req, res) => {
      const result = await commentCollection.find().toArray();
      res.send(result);
    });

    app.post("/comment", async (req, res) => {
      const result = await commentCollection.insertOne(req.body);
      res.send(result);
    });

    app.delete("/comment/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await commentCollection.deleteOne(query);
      res.send(result);
    });

    console.log("MongoDB connection successful!");
  } finally {
    // keep connection alive for server
  }
}

run().catch(console.dir);

// ---------------------
// ROOT ROUTE
// ---------------------
app.get("/", (req, res) => {
  res.send("Insta Sohor server is running");
});

// ---------------------
// START SERVER
// ---------------------
app.listen(port, () => {
  console.log(`Insta Sohor server is running on port: ${port}`);
});
