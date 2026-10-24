const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservation.controller');
const { requireAuth } = require('../middleware/auth.middleware');

// All authenticated users can view/create/cancel reservations
router.get('/', requireAuth, reservationController.getReservations);
router.post('/', requireAuth, reservationController.createReservation);
router.delete('/:id', requireAuth, reservationController.cancelReservation);

module.exports = router;
