const {Sequelize, DataTypes} = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

// Connect to database
const sequelize = new Sequelize(process.env.PG_DATABASE, process.env.PG_USER, process.env.PG_PASSWORD, {
    host: process.env.PG_HOST,
    dialect: 'postgres',
    port: process.env.PG_PORT,
});

// Test connection
sequelize.authenticate()
    .then(() => console.log('Connection has been established successfully.'))
    .catch((error) => console.error('Unable to connect to the database:', error));

const db = {};
db.sequelize = Sequelize;
db.sequelize = sequelize;

// Models/tables
db.users = require('./user.model')(sequelize, DataTypes);

module.exports = db;