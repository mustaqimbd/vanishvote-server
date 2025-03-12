import httpStatus from "http-status";
import { ZodError, ZodIssue } from "zod";
import { TErrorMessages, TIErrorResponse } from "../middlewares/error.interface";


const handleJodError = (err: ZodError): TIErrorResponse => {
  const errorMessages: TErrorMessages[] = err.issues.map((issue: ZodIssue) => ({
    path: `${issue?.path[issue?.path.length - 1]}`,
    message: issue?.message,
  }));

  return {
    statusCode: httpStatus.BAD_REQUEST,
    message: "Validation error",
    errorMessages,
  };
};

export default handleJodError;
