import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { map } from 'rxjs';
import { AuthService } from '../services/auth.service';

export function roleGuard(expectedRole: string): CanActivateFn {
  return () => {
    const role = localStorage.getItem('role'); 
    console.log('User Role in Guard:', role); 
    console.log('Expected Role:', expectedRole); 
    return role === expectedRole; 
  };
}
