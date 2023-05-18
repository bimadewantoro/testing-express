/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('permissions', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    })
    const sequenceExists = await queryInterface.sequelize.query(
      "SELECT EXISTS (SELECT 1 FROM pg_sequences WHERE schemaname = 'public' AND sequencename = 'permissions_id_seq');"
    )

    if (!sequenceExists[0][0].exists) {
      await queryInterface.sequelize.query(
        'CREATE SEQUENCE permissions_id_seq;'
      )
      await queryInterface.sequelize.query(
        'ALTER TABLE permissions ALTER COLUMN id SET DEFAULT nextval(\'permissions_id_seq\');'
      )
    }
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('permissions')
    await queryInterface.sequelize.query(
      'DROP SEQUENCE permissions_id_seq;'
    )
  }
}
