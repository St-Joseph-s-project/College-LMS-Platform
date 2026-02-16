import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { Response as sendResponse } from '../../utils';
import { STATUS_CODE } from '../../constants/appConstants';

export const authValidators = {
	login: [
		body('email')
			.exists({ checkFalsy: true })
			.withMessage('email is required')
			.isEmail()
			.withMessage('enter a correct email'),

		body('password')
			.exists({ checkFalsy: true })
			.withMessage('password is required')
			.isString()
			.withMessage('password must be a string')
	]
};

export const handleValidation = (req: Request, res: Response, next: NextFunction) => {
	const errors = validationResult(req);
		if (!errors.isEmpty()) {
				const first = errors.array()[0];
				return sendResponse({
						data: { message: first.msg ?? first },
						res,
						statusCode: STATUS_CODE.BAD_REQUEST,
				});
		}
		next();
};

// convenience middleware: validation chains + result checker
export const loginValidator = [...authValidators.login, handleValidation];
