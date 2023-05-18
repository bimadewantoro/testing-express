/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('merchants', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      merchant_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      merchant_description: {
        type: Sequelize.STRING,
        allowNull: false
      },
      merchant_city: {
        type: Sequelize.STRING,
        allowNull: false
      },
      merchant_postalcode: {
        type: Sequelize.STRING,
        allowNull: false
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      merchant_action: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      action_date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      merchant_status: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      approved_by: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      rejected_by: {
        type: Sequelize.INTEGER,
        allowNull: true
      }
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('merchants')
  }
}
