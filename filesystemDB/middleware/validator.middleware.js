import { body, validationResult } from 'express-validator';

export const validateItem = [
  body('id').exists().withMessage('ID is required').isNumeric().withMessage('ID must be a number'),
  body('name').exists().withMessage('Name is required').isString().withMessage('Name must be a string'),
  (req, res, next) => {
    const errors = validationResult(req);
    
    const allowedFields = ['id', 'name'];
    const invalidFields = Object.keys(req.body).filter(key => !allowedFields.includes(key));
    if (invalidFields.length > 0) {
      errors.errors.push({ msg: `Invalid fields: ${invalidFields.join(', ')}` });
    }

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];
