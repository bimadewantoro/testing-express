'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('roles', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        created_at: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
        updated_at: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        }
    });
    const sequenceExists = await queryInterface.sequelize.query(
        `SELECT 1 FROM pg_sequences WHERE schemaname = 'public' AND sequencename = 'roles_id_seq'`
    );
    if(!sequenceExists[0][0]) {
        await queryInterface.sequelize.query(
            'CREATE SEQUENCE roles_id_seq;'
        );
        await queryInterface.sequelize.query(
            'ALTER TABLE roles ALTER COLUMN id SET DEFAULT nextval(\'roles_id_seq\');'
        );
    }
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.sequelize.query(
        'DROP SEQUENCE roles_id_seq;'
    );
    await queryInterface.dropTable('roles');
  }
};
