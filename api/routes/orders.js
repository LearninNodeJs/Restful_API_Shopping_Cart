const express = require('express');
const router = express.Router();
const ordersController = require('../controller/orderController');

router.get('/',ordersController.getAllOrders);
router.post('/',ordersController.createOrder);
router.get('/:productId',ordersController.getOrderById);
router.delete('/:orderId',ordersController.deleteOrderById);

module.exports = router;
