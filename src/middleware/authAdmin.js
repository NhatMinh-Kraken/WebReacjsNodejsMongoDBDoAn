// const Users = require('../model/userModel')
const Users = require('../models/user')
const db = require('../models/index')

const authAdmin = async (req, res, next) => {
    try {
        const user = await db.Users.findOne({
            where: {
                id: req.user.id
            }
        })

        if (user.role !== 1) {
            return res.status(400).json({ msg: "Admin resources access denied." })
        }

        next();
    } catch (err) {
        return res.status(500).json({ msg: err.message })
    }
}

module.exports = authAdmin