import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { classToPlain } from "class-transformer";
import { map, Observable } from "rxjs";
import { Response } from 'express';
@Injectable()
export class TransformInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        return next.handle().pipe(
            map(data => {
                const response = context.switchToHttp().getResponse<Response>(); 
                const statusCode = response.statusCode;
                const statusMessage = response.statusMessage;
                const responseObj = {
                    result: data,
                    statusCode,
                    success: true,
                    message: statusMessage ?? ''
                }
                return classToPlain(responseObj);
            })
        );
    }
}