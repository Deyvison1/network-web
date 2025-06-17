import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class RouterService {
  private readonly router = inject(Router);

  redirectionTo(url: string) {
    this.router.navigateByUrl(url);
  }
}
