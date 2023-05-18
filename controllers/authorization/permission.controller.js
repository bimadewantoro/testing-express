const Permission = require('../../models/authorization/permission.model')

/**
 * Create a new permission
 *
 * @param req
 * @param res
 */
exports.createPermission = async (req, res) => {
  try {
    const { permission } = req.body
    const newPermission = new Permission({ permission })
    const createdPermission = await newPermission.createPermission()
    res.status(201).send(createdPermission)
  } catch (error) {
    console.log(error)
  }
}

/**
 * Get a permission
 *
 * @param req
 * @param res
 */
exports.getPermission = async (req, res) => {
  try {
    const { permission } = req.params
    const newPermission = new Permission({ permission })
    const foundPermission = await newPermission.getPermission()
    res.status(200).send(foundPermission)
  } catch (error) {
    console.log(error)
  }
}
