const { Village, User } = require('../models/')
const Redis = require("ioredis")
class VillageController { 

  static async getDataVillage(req, res, next) {
    const { VillageId } = req.currentUser
    try {
      
      const data = await Village.findByPk(VillageId, { include: User })

      res.status(200).json(data)
    } catch (error) {
      next(error)
    }
  }

  static async updateVillage(req, res, next){
    const { VillageId } = req.currentUser
    const { location, name } = req.body
    try {
      await Village.update( { location, name } ,{ where : { id: VillageId }})

      res.status(200).json({ message: "Success Update Village" })
    } catch (error) {
      next(error)
    }
  }

  static async deleteVillage(req, res, next) {
    const { id } = req.params
    try {
      await Village.destroy({ where : { id }})

      res.status(200).json({ message: "Success Delete Village" })
    } catch (error) {
      next(error)
    }
  }

}

module.exports = VillageController
