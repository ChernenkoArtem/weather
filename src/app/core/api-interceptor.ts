import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@env';

@Injectable()
export class APIInterceptor implements HttpInterceptor {
  constructor() {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (req.url.startsWith(this.getApiServerUrl())) {
      return next.handle(req);
    }
    const newParams = this.updateRequestParams(req.params);
    const apiReq = req.clone({
      url: `${this.getApiServerUrl()}/${req.url}`,
      params: newParams,
    });

    return next.handle(apiReq);
  }

  private getApiServerUrl() {
    return environment.apiUrl;
  }

  private updateRequestParams(params: HttpParams) {
    let newParams = params;
    newParams = newParams.set('key', environment.apiKey);
    return newParams;
  }
}
