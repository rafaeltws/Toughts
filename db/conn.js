const { Sequelize } = require('sequelize')

const sequelize = new Sequelize('toughts', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
})

try {
    sequelize.authenticate()
    console.log('Conectamos com o sucesso!')
  } catch (error) {
    console.error('Não foi possível conectar:', error)
  }
  
  module.exports = sequelize
  