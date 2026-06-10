import { Request, Response, NextFunction } from 'express';

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction): Response => {
  const statusCode = res.statusCode ? res.statusCode : 500;
  const message = err.message ? err.message : 'something went wrong';
  return res.status(statusCode).send({ message });
};

export default errorHandler;
