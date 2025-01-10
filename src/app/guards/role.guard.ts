import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';

export function roleGuard(expectedRoles: string | string[]): CanActivateFn {
  return () => {
    const role = localStorage.getItem('role');
    console.log('Lietotāja loma:', role);
    console.log('Pieļaujamās lomas:', expectedRoles);

    const allowedRoles = Array.isArray(expectedRoles) ? expectedRoles : [expectedRoles];
    
    return role !== null && allowedRoles.includes(role);
  };
}
