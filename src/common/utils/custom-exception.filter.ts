import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";
import { Response } from 'express'

@Catch()
export class CustomExceptionsFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost): void {
        const context = host.switchToHttp();
        const response = context.getResponse<Response>();
        let status = 500;
        let message = "Error Occured";
        try {
          status = exception instanceof HttpException ? exception.getStatus() : 500;
          message = exception instanceof HttpException ? exception.getResponse()["message"] : 'Fetching data failed.';
        } catch(e) {
          console.log("getting message and status failed ", e);
        }

        response
          .status(status)
          .json({
            message,
            statusCode: status,
            result: null,
            success: false,
          })
      
    }
}