import { DOCUMENT } from '@angular/common';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const document = inject(DOCUMENT);
  const localStorage: Storage | undefined = document.defaultView?.localStorage;
  const isLoggedIn = localStorage?.getItem('isLoggedIn');


  if (isLoggedIn) {
    return true;
  }

  router.navigate(['/login']);
  return false;
  
};