const express = require('express');

const tourController = require('./../controller/tourController');
const authController = require('./../controller/authController');

// Import Review Router for nested routing
const reviewRouter = require('./reviewRoutes');

const router = express.Router();

// POST /tour/23fad4/reviews
// GET /tour/23fad4/reviews
// GET /tour/23fad4/reviews/9488fn23

// router
//   .route('/:tourId/reviews')
//   .post(
//     authController.protect,
//     authController.restrictTo('user'),
//     reviewController.createReview
//   );

// Just like in app.js
router.use('/:tourId/reviews', reviewRouter);

// Aliasing example
router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);

router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

// Routes to Get all Tours and create new tour
router
  .route('/')
  .get(authController.protect, tourController.getAllTours)
  .post(tourController.createTour);

// Route to get tour by id, update a tour and delete a tour
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  );

module.exports = router;
