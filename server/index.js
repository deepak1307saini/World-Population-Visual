const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 3001;

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
  })
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://2019kuec2053:fV2Aoopctegt3Pvs@cluster0.necznpn.mongodb.net/worldbank?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define a schema for the data
const dataSchema = new mongoose.Schema({
    country: String,
    year: Number,
    population: Number,
  });  

const DataModel = mongoose.model('worldpopulation', dataSchema);

app.get('/',(req,res)=>{
    res.json("Hello")
});

// Filter data route
app.post('/filter-data', async (req, res) => {
    const { countries, fromYear, toYear } = req.body;
    console.log("Hi Deepak1");
    // Define filters based on request parameters
    const filters = {};
  
    // If countries are specified, add them to the filter
    if (countries && countries.length > 0) {
      filters.country = { $in: countries };
    }
  
    // If fromYear is not specified, default to 1973
    if (!fromYear) {
      filters.year = { $gte: 1973 };
    } else {
      filters.year = { $gte: parseInt(fromYear) };
    }
  
    // If toYear is not specified, default to 2022
    if (!toYear) {
      filters.year.$lte = 2022;
    } else {
      filters.year.$lte = parseInt(toYear);
    }
  
    try {
      console.log("Hi Deepak12");
      const filteredData = await DataModel.find(filters);
      console.log("Hi Deepak13");
      res.json(filteredData);
    } catch (error) {
      res.status(500).json({ error: 'Failed to filter data' });
    }
  });
  

app.listen(() => {
  console.log(`Server is running on port ${port}`);
});
