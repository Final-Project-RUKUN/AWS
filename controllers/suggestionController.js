const { Suggestion, Village, User } = require('../models')
const Redis = require("ioredis")
const redis = new Redis()

const SUGGEST_CHACE = 'suggestion:data'
class SuggestionConroller {
  static async fetchSuggestions(req, res, next){
    const { VillageId } = req.currentUser
    try {
      const CACHE_FROM_REDIS = await redis.get(SUGGEST_CHACE)

      if (!CACHE_FROM_REDIS) {
        const villageSuggestions = await Village.findOne({where : { id : VillageId}, 
          include: {
            model: Suggestion,
            separate: true,
            order: [['createdAt', 'DESC']],
            include: User
          }
        })
        redis.set(SUGGEST_CHACE, JSON.stringify(villageSuggestions))
        res.status(200).json(villageSuggestions)
      } else {
        res.status(200).json(JSON.parse(CACHE_FROM_REDIS))
      }
      
    } catch (error) {
      next(error)
    }
  }

  static async addSuggestion(req, res, next){
    const { title, description, type } = req.body
    const { id, VillageId } = req.currentUser

    try {
      const suggestion = await Suggestion.create({title, description, type, UserId: id, VillageId})
      redis.del(SUGGEST_CHACE)
      res.status(201).json(suggestion)
    } catch (error) {
      next(error)
    }
  }
  
  static async deleteSuggestion(req, res, next){
    const { id } = req.params

    try {
      await Suggestion.destroy({ where : { id }, returning : true })
      redis.del(SUGGEST_CHACE)
      res.status(200).json({ message: 'Suggestion has been successfully deleted.'})
    } catch (error) {
      next(error)
    }
  }
}

module.exports = SuggestionConroller
