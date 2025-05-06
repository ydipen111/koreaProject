import express from 'express';
import { getAllUser, getUserProfile, login, signUp, updateUser } from '../Controllers/authController.js';
import validator from 'express-joi-validation';
import Joi from 'joi';
import { userCheck } from '../MiddleWare/authCheck.js';

const router = express.Router();
const validate = validator.createValidator({});

const singUpSchema = Joi.object({
  fname: Joi.string().required(),
  lname: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
})

router.route('/user/signup').post(validate.body(singUpSchema), signUp);
router.route('/user/login').post(login);
router.route('/user/profile').get(userCheck, getUserProfile);
router.route('/user/getAllUser').get(getAllUser);
router.route('/user/updateUser').patch(userCheck, updateUser);


export default router;