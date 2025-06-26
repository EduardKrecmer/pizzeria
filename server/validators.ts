import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

// Sanitizácia pre meno zákazníka
export const sanitizeCustomerName = body('customerName')
  .trim()
  .isLength({ min: 2, max: 50 })
  .withMessage('Meno musí mať 2-50 znakov')
  .matches(/^[a-zA-ZáäčďéíĺľňóôŕšťúýžÁÄČĎÉÍĹĽŇÓÔŔŠŤÚÝŽ\s]+$/)
  .withMessage('Meno môže obsahovať len písmená a medzery')
  .escape();

// Sanitizácia pre email
export const sanitizeEmail = body('customerEmail')
  .optional()
  .isEmail()
  .withMessage('Neplatný formát emailu')
  .normalizeEmail()
  .trim();

// Sanitizácia pre telefón
export const sanitizePhone = body('customerPhone')
  .trim()
  .matches(/^[0-9\s\-+()]{9,15}$/)
  .withMessage('Neplatný formát telefónu')
  .escape();

// Sanitizácia pre adresu
export const sanitizeAddress = body('deliveryAddress')
  .trim()
  .isLength({ min: 5, max: 100 })
  .withMessage('Adresa musí mať 5-100 znakov')
  .matches(/^[a-zA-Z0-9áäčďéíĺľňóôŕšťúýžÁÄČĎÉÍĹĽŇÓÔŔŠŤÚÝŽ\s\-.,/]+$/)
  .withMessage('Adresa obsahuje nepovolené znaky')
  .escape();

// Sanitizácia pre mesto
export const sanitizeCity = body('deliveryCity')
  .trim()
  .isLength({ min: 2, max: 50 })
  .withMessage('Mesto musí mať 2-50 znakov')
  .matches(/^[a-zA-ZáäčďéíĺľňóôŕšťúýžÁÄČĎÉÍĹĽŇÓÔŔŠŤÚÝŽ\s\-]+$/)
  .withMessage('Mesto môže obsahovať len písmená, medzery a pomlčky')
  .escape();

// Sanitizácia pre PSČ
export const sanitizePostalCode = body('deliveryPostalCode')
  .trim()
  .matches(/^[0-9]{3}\s?[0-9]{2}$/)
  .withMessage('PSČ musí byť v formáte 123 45')
  .escape();

// Sanitizácia pre poznámky
export const sanitizeNotes = body('notes')
  .optional()
  .trim()
  .isLength({ max: 500 })
  .withMessage('Poznámky môžu mať maximálne 500 znakov')
  .escape();

// Validácia typu doručenia
export const validateDeliveryType = body('deliveryType')
  .isIn(['DELIVERY', 'PICKUP'])
  .withMessage('Typ doručenia musí byť DELIVERY alebo PICKUP');

// Validácia ceny
export const validateTotalAmount = body('totalAmount')
  .isFloat({ min: 0, max: 1000 })
  .withMessage('Celková suma musí byť medzi 0 a 1000€');

// Validácia položiek objednávky
export const validateOrderItems = body('items')
  .isArray({ min: 1, max: 20 })
  .withMessage('Objednávka musí obsahovať 1-20 položiek')
  .custom((items) => {
    for (const item of items) {
      if (!item.pizzaId || typeof item.pizzaId !== 'number') {
        throw new Error('Každá položka musí mať platné pizzaId');
      }
      if (!item.quantity || typeof item.quantity !== 'number' || item.quantity < 1 || item.quantity > 10) {
        throw new Error('Množstvo musí byť číslo medzi 1 a 10');
      }
      if (item.extras && !Array.isArray(item.extras)) {
        throw new Error('Extras musia byť pole');
      }
    }
    return true;
  });

// Middleware na kontrolu validačných chýb
export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Neplatné údaje',
      errors: errors.array().map(err => err.msg)
    });
  }
  next();
};

// Kombinovaná validácia pre objednávky
export const validateOrder = [
  sanitizeCustomerName,
  sanitizeEmail,
  sanitizePhone,
  sanitizeAddress,
  sanitizeCity,
  sanitizePostalCode,
  sanitizeNotes,
  validateDeliveryType,
  validateTotalAmount,
  validateOrderItems,
  handleValidationErrors
];