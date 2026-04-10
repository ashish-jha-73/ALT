require('dotenv').config();
const mongoose = require('mongoose');
const { connectDB } = require('../config/db');
const Question = require('../models/Question');
const { questions } = require('./seedQuestions');

async function seed() {
  try {
    await connectDB();
    await Question.deleteMany({});
    const inserted = await Question.insertMany(questions);
    console.log(`Seeded ${inserted.length} questions successfully`);
  } catch (error) {
    console.error('Seeding failed:', error.message);
  } finally {
    await mongoose.connection.close();
  }
}

seed();
