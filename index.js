import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from "mongoose";
import User from './models/userModel.js';
import { Disaster } from './models/disasterModel.js';
import axios from 'axios';

// server.js
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
mongoose.connect('mongodb+srv://juhan:Iamjuhan@cluster0.5yhrs.mongodb.net/disaster_app').then(() => {
  console.log('Connected to MongoDB');
});


// Define a route for creating a new user
app.post('/users', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json({ message: 'User created successfully', user });
  } catch (error) {
    res.status(400).json({ message: 'Failed to create user', error });
  }
});

// Define a route for fetching all users
app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ message: 'Users fetched successfully', users });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users', error });
  }
});

// add a register route
app.post('/register', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    res.status(400).json({ message: 'Failed to register user', error });
  }
});


// add a login route
app.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email, password: req.body.password });
    if (!user) {
      return res.status(404).json({ message: 'Invalid email or password' });
    }
    res.status(200).json({ message: 'Login successful', user });
  } catch (error) {
    res.status(500).json({ message: 'Failed to login', error });
  }
});



// Routes for User Features

// Get current weather
app.get('/weather/current', (req, res) => {
  // Fetch weather API data here
  res.json({ message: 'Today\'s weather' });
});

// Get weather forecast
app.get('/weather/forecast', async (req, res) => {

  const lat = `23.746466`
  const lon = `90.376015`
  const API_KEY = `e614f366afcadbe875379ef299e9198e`
  const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

  try {
    const response = await axios.get(weatherUrl);
    console.log(response.data);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    res.status(500).json({ message: 'Failed to fetch weather data' });
  }
});

// Get recent & upcoming disasters
app.get('/disasters/recent-upcoming', async (req, res) => {
  const disasters = await Disaster.find().sort({ date: -1 });
  res.json({ disasters });
});

// Get disaster details by ID
app.get('/disasters/:id', async (req, res) => {
  const disaster = await Disaster.findById(req.params.id);
  if (disaster) {
    res.json(disaster);
  } else {
    res.status(404).json({ message: 'Disaster not found' });
  }
});

// Admin Routes

// Add new disaster
app.post('/admin/disasters', async (req, res) => {
  try {
    const newDisaster = new Disaster(req.body);
    await newDisaster.save();
    res.status(201).json({ message: 'Disaster added successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Failed to add disaster', error });
  }
});

// Delete disaster by ID
app.delete('/admin/disasters/:id', async (req, res) => {
  try {
    await Disaster.findByIdAndDelete(req.params.id);
    res.json({ message: 'Disaster deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Failed to delete disaster', error });
  }
});

// Edit disaster by ID
app.put('/admin/disasters/:id', async (req, res) => {
  try {
    const updatedDisaster = await Disaster.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedDisaster) {
      return res.status(404).json({ message: 'Disaster not found' });
    }
    res.json({ message: 'Disaster updated successfully', updatedDisaster });
  } catch (error) {
    res.status(400).json({ message: 'Failed to update disaster', error });
  }
});

// Admin can send disaster alerts via email (pseudo code for sending email)
app.post('/admin/notifications', (req, res) => {
  const { email, disasterInfo } = req.body;
  // Call an email service here (e.g., using Nodemailer or SendGrid)
  res.json({ message: 'Notification sent to users' });
});


// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
