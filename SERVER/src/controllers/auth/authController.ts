import { Request, Response as ExpressResponse } from 'express';
import { Response } from '../../utils';
import { STATUS_CODE } from '../../constants/appConstants';
import { loginService } from '../../services/auth/authService';

export const loginController = async (req: Request, res: ExpressResponse) => {
  try {
    const { email, password } = req.body;

    const result = await loginService({ email: email, password });

    return Response({ res, data: result, message: "Login Sucessfull", statusCode: STATUS_CODE.OK });
  } catch (err: any) {
    return Response({
      res,
      data: null,
      message:err.message,
      statusCode: STATUS_CODE.UNAUTHORIZED,
    });
  }
};

export default loginController;