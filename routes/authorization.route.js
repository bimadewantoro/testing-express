const express = require('express')

const router = express.Router()
const permissionController = require('../controllers/authorization/permission.controller')
const roleController = require('../controllers/authorization/role.controller')
const rolePermissionController = require('../controllers/authorization/rolePermission.controller')
const userRoleController = require('../controllers/authorization/userRole.controller')

// Permission routes
router.post('/permissions', permissionController.createPermission)

// Role routes
router.post('/roles', roleController.createRole)

// Role permission routes
router.post('/role-permissions', rolePermissionController.createRolePermission)

// User role routes
router.post('/user-roles', userRoleController.createUserRole)

module.exports = router
