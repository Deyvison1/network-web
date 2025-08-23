import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';

export class HttpService {
  protected readonly http = inject(HttpClient);
}
