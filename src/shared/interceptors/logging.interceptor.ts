import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CustomLoggerService } from '../modules/custom-logger/custom-logger.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  @Inject(CustomLoggerService)
  private readonly customLoggerService: CustomLoggerService;

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const contextName = LoggingInterceptor.name;
    const startedTimestamp = Date.now();

    const request = context.switchToHttp().getRequest();
    const { method, url, params, query, body, headers } = request;

    return next.handle().pipe(
      map((data) => {
        const response = context.switchToHttp().getResponse();
        const statusCode = response.statusCode;

        this.log({
          method,
          url,
          params,
          query,
          body,
          headers,
          statusCode,
          responseBody: data,
          startedTimestamp,
          context: contextName
        });

        return data;
      }),
      catchError((error) => {
        const response = JSON.parse(JSON.stringify(error));
        const statusCode = response.status;
        const responseBody = response.response;

        this.log({
          method,
          url,
          params,
          query,
          body,
          headers,
          statusCode,
          responseBody,
          startedTimestamp,
          context: contextName,
          trace: error.stack
        });

        return throwError(error);
      })
    );
  }

  private logOverallInfo(
    method: string,
    url: string,
    statusCode: number,
    executionTime: number,
    context: string,
    trace?: string
  ) {
    const message = `[${method}] ${url} - ${statusCode} - ${executionTime}ms`;

    if (statusCode >= 500) {
      return this.customLoggerService.error(message, trace, context);
    }
    if (statusCode >= 400) {
      return this.customLoggerService.warn(message, context);
    }
    return this.customLoggerService.info(message, context);
  }

  private logRequest(input: {
    params: any,
    query: any,
    body: any,
    headers: any
  }) {
    const jsonHeaders = JSON.stringify(input.headers);
    const jsonParams = JSON.stringify(input.params);
    const jsonQuery = JSON.stringify(input.query);
    const jsonBody = JSON.stringify(input.body);

    console.log(`Request headers ${jsonHeaders}`);

    console.log(`Request input: { Params: ${jsonParams}, ` +
      `Query: ${jsonQuery}, ` +
      `Body: ${jsonBody} }`
    );

    return;
  }

  private logResponse(body: any) {
    const jsonBody = JSON.stringify(body);

    const displayedBody = jsonBody.length > 150
      ? `${jsonBody.slice(0, 150)}...`
      : jsonBody;

    console.log(`Response body: ${displayedBody}`);

    return;
  } 

  private log(info: {
    method: string,
    url: string,
    params: any,
    query: any,
    body: any,
    headers: any,
    statusCode: number,
    responseBody: any,
    startedTimestamp: number,
    context: string,
    trace?: string
  }) {
    const { method, url, params, query, body, headers,
      statusCode, responseBody, startedTimestamp,
      context, trace
    } = info;
    
    const executionTime = Date.now() - startedTimestamp;

    this.logOverallInfo(method, url, statusCode, executionTime, context, trace);
    this.logRequest({ params, query, body, headers });
    this.logResponse(responseBody);

    return;
  }
}