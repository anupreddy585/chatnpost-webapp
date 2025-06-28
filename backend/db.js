const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect('mongodb+srv://anupreddy64:DASY0t1VndK7y4H4@cluster1.7afqsqz.mongodb.net/', {
      useNewUrlParser: true,
    });
    console.log(`MongoDB Connected`);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}
module.exports = connectDB;