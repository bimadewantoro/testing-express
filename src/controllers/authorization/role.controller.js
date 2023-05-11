const Role = require('../../models/authorization/role.model');

/**
 * Create a new role
 *
 * @param req
 * @param res
 */
exports.createRole = async (req, res) => {
    try {
        const { role } = req.body;
        const newRole = new Role({ role });
        const createdRole = await newRole.createRole();
        res.status(201).send(createdRole);
    } catch (error) {
        console.log(error);
    }
}

/**
 * Get a role
 *
 * @param req
 * @param res
 */
exports.getRole = async (req, res) => {
    try {
        const { role } = req.params;
        const newRole = new Role({ role });
        const foundRole = await newRole.getRole();
        res.status(200).send(foundRole);
    } catch (error) {
        console.log(error);
    }
}