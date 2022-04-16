/* eslint-disable max-len */
/* eslint-disable no-use-before-define */
/* eslint-disable prefer-const */
/* eslint-disable no-shadow */
/* eslint-disable no-undef */
/* eslint-disable consistent-return */
/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
import { customers } from '../../models';
import {
  successResponse, errorResponse, uniqueId, pagination,
} from '../../helpers';

const { Op } = require('sequelize');

export const addCustomer = async (req, res) => {
  try {
    const {
      cust_name, cust_email, cust_mob, cust_address,
    } = req.body;
    if (cust_name == null && cust_email == null && cust_mob == null && cust_address == null) {
      req.flash('error', errorResponse(req, res, 'Please fill up all details'));
      return res.redirect('/customer');
    }
    const email = await customers.findOne({
      where: { cust_email },
    });

    if (email) {
      req.flash('error', errorResponse(req, res, 'Customer already exist'));
      return res.redirect('/customer/add/');
    }
    const custload = {
      cust_name,
      cust_email,
      cust_mob,
      cust_address,
    };
    const newCustomer = await customers.create(custload);
    customers.update({ isDeleted: false }, { where: { cust_name } });
    req.flash('error', successResponse(req, res, 'Data Added Successfully'));
    res.redirect('/customer/');
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

export const customerList = async (req, res) => {
  try {
    pagination(req, res, customers, 'viewCustomer');
  } catch (error) {
    return res.render('viewCustomers', {
      data: errorResponse(req, res, error.message),
    });
  }
};

export const editCustomerView = async (req, res) => {
  const idd = await customers.findOne({
    where: { id: req.params.id },
  });
  if (!idd) {
    req.flash('error', errorResponse(req, res, 'Customer does not exist'));
    return res.redirect('/customer');
  }
  res.render('editCustomer', { customers: idd });
};

export const editCustomer = async (req, res) => {
  try {
    const {
      id, cust_name, cust_email, cust_mob, cust_address,
    } = req.body;
    if (cust_name == null && cust_email == null && cust_mob == null && cust_address == null) {
      req.flash('error', errorResponse(req, res, 'Please fill up all details'));
      return res.redirect('/customer');
    }
    const custload = {
      cust_name,
      cust_email,
      cust_mob,
      cust_address,
    };
    const updateCustomer = await customers.update(custload, {
      where: {
        id,
      },
    });
    req.flash('error', successResponse(req, res, 'Data Updated Successfully'));
    res.redirect('/customer/');
  } catch (error) {
    req.flash('error', errorResponse(req, res, error.message));
    return res.redirect(`/customer/edit/${id}`);
  }
};

export const deleteCustomer = async (req, res) => {
  try {
    const idd = await customers.findOne({
      where: { id: req.params.id },
    });
    if (!idd) {
      throw new Error('User Not Found');
    }
    // const deleteCustomer = await customers.destroy({
    //   where: {
    //     id: req.params.id,
    //   },
    // });
    const deleteCustomer = await customers.update({ isDeleted: true }, { where: { id: req.params.id } });
    req.flash('error', successResponse(req, res, 'Data Deleted Successfully'));
    return res.redirect('/customer/');
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

// export const searchCustomer = async (req, res) => {
//   try {
//     pagination(req, res, customers, 'viewCustomer');
//   } catch (error) {
//     return res.render('viewCustomer', {
//       data: errorResponse(req, res, error.message),
//     });
//   }
// };

export const searchCustomer = async (req, res) => {
  try {
    // pagination(req, res, customers, 'viewCustomer');
    let payload = req.body.payload.trim();
    let search = await customers.findAll({ where: { cust_name: { [Op.iLike]: `%${payload}%` } } });
    return res.send({ payload: search });
    // res.render('viewCustomer', { data: search });
    // console.log('--------');
    // let xyz = search;
    // console.log(xyz);
    // return res.render('viewCustomer', { data: xyz });
  } catch (error) {
    return res.render('viewCustomer', {
      data: errorResponse(req, res, error.message),
    });
  }
};
