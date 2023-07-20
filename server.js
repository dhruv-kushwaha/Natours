const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  console.log('Uncaught Exception 💥 Shutting Down');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB).then(() => {
  console.log(`DATABASE CONNECTION SUCCESSFULL 🫡🫡`);
});

const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION 💥 Shutting Down');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// TEST
