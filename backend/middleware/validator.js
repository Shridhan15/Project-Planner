import { check } from 'express-validator';

 const registerValidator = [
  check('name', 'Name is required').notEmpty(),
  check('email', 'Valid email required').isEmail(),
  check('password', 'Password min 6 chars').isLength({ min: 6 })
];

 const loginValidator = [
  check('email', 'Valid email required').isEmail(),
  check('password', 'Password required').exists()
];

export { registerValidator, loginValidator };