require('dotenv').config()
const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 3000
const cors = require('cors') // Import the cors package for allowing cross-origin requests

app.use(cors()) // Enable CORS for all routes
app.use(express.json()) // Parse JSON bodies

app.get('/', (req, res) => {
    res.send('Hello World!')
})
// MongoDB connection URI
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@xihads-xone.ftg87hg.mongodb.net/?retryWrites=true&w=majority&appName=Xihads-Xone`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional startPing in v4.7)
        // await client.connect();

        const coffeeCollection = client.db("coffeeDB").collection("coffees"); // Make sure to use the correct database and collection names
        const userCollection = client.db("coffeeDB").collection("users");


        //**************Coffee related Api************************
        // method - (post/Create)
        app.post('/coffees', async (req, res) => {
            const newCoffee = req.body;
            // console.log(newCoffee);
            const result = await coffeeCollection.insertOne(newCoffee);
            res.send(result);
        });

        // method - (get all)
        app.get('/coffees', async (req, res) => {
            // const cursor = coffeeCollection.find();
            // const result = await cursor.toArray();
            const result = await coffeeCollection.find().toArray();
            res.send(result);
        });


        // method - (delete)
        app.delete('/coffees/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await coffeeCollection.deleteOne(query);
            res.send(result);
        });


        // method - (read just one coffee)
        app.get('/coffees/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await coffeeCollection.findOne(query);
            res.send(result);
        });


        // method - (update-one/ put)
        app.put('/coffees/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const updatedCoffee = req.body;
            const options = { upsert: true };
            const updateDoc = {
                $set: updatedCoffee
            }
            const result = await coffeeCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        });



        //*************User related Api************************
        // method - (post/Create)
        app.post('/users', async (req, res) => {
            const newUser = req.body;
            // console.log(newUser);
            const result = await userCollection.insertOne(newUser);
            res.send(result);
        });


        // method - (get all)
        app.get('/users', async (req, res) => {
            // const cursor = userCollection.find();
            // const result = await cursor.toArray();
            const result = await userCollection.find().toArray();
            res.send(result);
        });

        // method - (update user data)
        app.patch('/users', async (req, res) => {
            // console.log(req.body);
            const { email, lastSignInTime } = req.body;
            const filter = { email: email };

            const updateDoc = {
                $set: {
                    lastSignInTime: lastSignInTime
                }
            }

            const result = await userCollection.updateOne(filter, updateDoc);
            res.send(result);
        });

        // method - (delete)
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await userCollection.deleteOne(query);
            res.send(result);
        });



















        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    }
    catch (err) {
        // Ensures that the client will close when you finish/error
        console.error(err);
    }
    // finally {
    // // Ensures that the client will close when you finish / error
    //     await client.close();
    // }
}
run().catch(console.dir);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})