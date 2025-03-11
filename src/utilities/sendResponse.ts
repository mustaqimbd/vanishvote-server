import { Response } from "express";


type TSendResponse<T> = {
    statusCode: number;
    success?: true;
    message?: string | null;
    data?: T | null;
};

const sendResponse = <T>(res: Response, data: TSendResponse<T>) => {
    const responseData: TSendResponse<T> = {
        success: true,
        statusCode: data?.statusCode,
        message: data?.message || "Successfully responded",
        data: data?.data || null,
    };
    res.status(data?.statusCode).json(responseData);
};

export default sendResponse;
