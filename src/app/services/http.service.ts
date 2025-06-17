import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';

export class HttpService {
  public readonly http = inject(HttpClient);
}
