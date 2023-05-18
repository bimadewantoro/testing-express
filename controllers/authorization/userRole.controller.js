const UserRole = require('../../models/authorization/userRole.model')

/**
 * Create a new userRole
 *
 * @param req
 * @param res
 */
exports.createUserRole = async (req, res) => {
  try {
    const { role, user } = req.body
    const newUserRole = new UserRole({ role, user })
    const createdUserRole = await newUserRole.createUserRole()
    res.status(201).send(createdUserRole)
  } catch (error) {
    console.log(error)
  }
}

/**
 * Get a userRole
 *
 * @param req
 * @param res
 */
exports.getUserRole = async (req, res) => {
  try {
    const { role, user } = req.params
    const newUserRole = new UserRole({ role, user })
    const foundUserRole = await newUserRole.getUserRole()
    res.status(200).send(foundUserRole)
  } catch (error) {
    console.log(error)
  }
}
