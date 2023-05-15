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
    await queryInterface.createTable('role_permission', {
        role_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'roles',
                key: 'id',
            },
            primaryKey: true,
        },
        permission_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'permissions',
                key: 'id',
            },
            primaryKey: true,
        }
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('role_permission');
  }
};
