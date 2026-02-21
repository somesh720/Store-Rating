const Rating = require('../models/Rating.model');

class RatingController {
  static async submitRating(req, res, next) {
    try {
      const { store_id, rating } = req.body;
      const user_id = req.user.id;

      const result = await Rating.createOrUpdate(user_id, store_id, rating);

      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  static async getUserRatings(req, res, next) {
    try {
      const userId = req.user.id;
      const ratings = await Rating.getUserRatings(userId);

      res.json(ratings);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = RatingController;