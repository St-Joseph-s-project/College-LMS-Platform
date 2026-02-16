import type { Response } from "express";

type ResponseType = {
  res: Response,
  data: any,
  statusCode: number,
  message: String
}
export  function Response({res, data, statusCode, message}: ResponseType){
  return res.status(statusCode).json({
    message: message,
    data: data,
    statusCode: statusCode
  })
}
