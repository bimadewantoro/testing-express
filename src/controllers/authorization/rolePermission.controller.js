const rolePermission = require('../../models/authorization/rolePermission.model');

/**
 * Create a new rolePermission
 *
 * @param req
 * @param res
 */
exports.createRolePermission = async (req, res) => {
    try {
        const { role, permission } = req.body;
        const newRolePermission = new rolePermission({ role, permission });
        const createdRolePermission = await newRolePermission.createRolePermission();
        res.status(201).send(createdRolePermission);
    } catch (error) {
        console.log(error);
    }
}

/**
 * Get a rolePermission
 *
 * @param req
 * @param res
 */
exports.getRolePermission = async (req, res) => {
    try {
        const { role, permission } = req.params;
        const newRolePermission = new rolePermission({ role, permission });
        const foundRolePermission = await newRolePermission.getRolePermission();
        res.status(200).send(foundRolePermission);
    } catch (error) {
        console.log(error);
    }
}