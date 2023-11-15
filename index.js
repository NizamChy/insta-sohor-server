// Backend mongodb index.jsx file 

const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

//midleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9s9fb7y.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const wishlistCollection = client.db("wishlistDB").collection("wishlist");

    const commentCollection = client.db("commentDB").collection("comment");

    app.get("/wishlist", async (req, res) => {
      const cursor = wishlistCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post("/wishlist", async (req, res) => {
      const wishlistItem = req.body;
      const result = await wishlistCollection.insertOne(wishlistItem);
      res.send(result);
    });

    app.delete("/wishlist/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: id };
      const result = await wishlistCollection.deleteOne(query);
      res.send(result);
    });

    const postsCollection = client.db("blogPostsDB").collection("allposts");

    app.get("/allposts", async (req, res) => {
      const cursor = postsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // Single post data
    app.get("/allposts/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await postsCollection.findOne(query);
      res.send(result);
    });

    app.get("/comment", async (req, res) => {
      const cursor = commentCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.post("/comment", async (req, res) => {
      const newComment = req.body;
      const result = await commentCollection.insertOne(newComment);
      res.send(result);
    });

    app.delete("/comment/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await commentCollection.deleteOne(query);
      res.send(result);
    })

    app.delete("/allposts/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await postsCollection.deleteOne(query);
      res.send(result);
    })

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

    app.post("/allposts", async (req, res) => {
      const newPost = req.body;
      console.log(newPost);
      const result = await postsCollection.insertOne(newPost);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// -------------------------------

app.get("/", (req, res) => {
  res.send("Insta Sohor server is running");
});

app.listen(port, () => {
  console.log(`Insta Sohor server is running on port: ${port}`);
});
