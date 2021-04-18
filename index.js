const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const MongoClient = require('mongodb').MongoClient;

require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qeqox.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()

app.use(bodyParser.json());
app.use(cors());
app.use(express.static('teams'));
app.use(fileUpload());





const port = 5050;

app.get('/', (req, res) => {
    res.send("hello world")
})

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const bookingCollection = client.db("touristGuide").collection("bookings");
  const teamsCollection = client.db("touristGuide").collection("teams");
 
  app.post('/addBooking', (req, res) => {
      const booking = req.body;
      bookingCollection.insertOne(booking)
      .then(result => {
          res.send(result.insertedCount)
      })
  })

  app.post('/dashboard', (req, res) => {
      const file = req.files.file;
      
      const name = req.body.name;
      const email = req.body.email;

      const newImg = file.data;
      const encImg = newImg.toString('base64');

      var image = {
          contentType: file.mimetype,
          size: file.size,
          img: Buffer.from(encImg, 'base64')
      };

    teamsCollection.insertOne({ name, email, image })
          .then(result => {
              res.send(result.insertedCount > 0);
          })
        })

});

app.listen(process.env.PORT || port)