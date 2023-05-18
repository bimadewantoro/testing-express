const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const process = require('process')

const basename = path.basename(__filename)
const env = process.env.NODE_ENV || 'development'
const config = require(path.join(__dirname, '..', 'config', 'config.json'))[env]
const dbSequelize = {}

let sequelize
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config)
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config)
}

fs
  .readdirSync(__dirname)
  .filter((file) => (
    file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
  ))
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes)
    dbSequelize[model.name] = model
  })

Object.keys(dbSequelize).forEach((modelName) => {
  if (dbSequelize[modelName].associate) {
    dbSequelize[modelName].associate(dbSequelize)
  }
})

dbSequelize.sequelize = sequelize
dbSequelize.Sequelize = Sequelize

module.exports = dbSequelize
