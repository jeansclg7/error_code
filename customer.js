/* eslint-disable import/named */
import express from 'express';

import * as userController from '../controllers/user/customer.controller';
import { editSchema, validateEditSchema, validateAddSchema } from '../controllers/user/customer.validator';
import { authenticateToken } from '../middlewares/authToken';

const router = express.Router();

//= ===============================
// Customers routes
//= ===============================

router.get('/add', (req, res) => {
  res.render('addCustomer');
});

router.get('/', authenticateToken, userController.customerList);

router.post('/add', authenticateToken, editSchema, validateAddSchema, userController.addCustomer);
router.get('/edit/:id', authenticateToken, userController.editCustomerView);
router.post('/edit', authenticateToken, editSchema, validateEditSchema, userController.editCustomer);
router.get('/delete/:id', authenticateToken, userController.deleteCustomer);
// router.post('/search', userController.searchCustomer);
router.post('/getCustomer', userController.searchCustomer);
module.exports = router;
