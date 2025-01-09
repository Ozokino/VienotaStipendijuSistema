import { Routes } from '@angular/router';
import { loggedInGuard } from './guards/logged-in.guard';
import { authGuard } from './guards/auth.guard';
import { LoginComponent } from './components/Users/login/login.component';
import { roleGuard } from './guards/role.guard';
// import { adminGuard } from './guards/admin.guard';


export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    {
        path: 'scholarship-list',
        loadComponent: () => import('./components/Scholarships/scholarship-list/scholarship-list.component').then((c) =>c.ScholarshipListComponent),
        canActivate: [authGuard]
       
    },
    {
        path: 'scholarship-details/:id',
        loadComponent: () => import('./components/Scholarships/scholarship-details/scholarship-details.component').then((c) =>c.ScholarshipDetailsComponent),
        canActivate: [authGuard]
    },
    {
        path: 'scholarship-create',
        loadComponent: () => import('./components/Scholarships/scholarship-create/scholarship-create.component').then((c) =>c.ScholarshipCreateComponent),
        canActivate: [authGuard]
    },
    {
        path: 'application-form/:scholarshipId',
        loadComponent: () => import('./components/application-form/application-form.component').then((c) => c.ApplicationFormComponent),
        canActivate: [authGuard]
      },
      {
        path: 'applications',
        loadComponent: () => import('./components/application-list/application-list.component').then((c) => c.ApplicationListComponent),
        canActivate: [authGuard]
      },
    {
        path: 'login',
        component: LoginComponent,
        canActivate: [loggedInGuard]
    },
    {
        path: 'register',
        loadComponent: () => import('./components/Users/register/register.component').then((c) => c.RegisterComponent),
        canActivate: [loggedInGuard]
    },
    {
        path: 'user-details/:id',
        loadComponent: () => import('./components/Users/user-details/user-details.component').then((c) => c.UserDetailsComponent),
        canActivate: [authGuard]
    },
    {
        path: 'user-list',
        loadComponent: () => import('./components/Users/user-list/user-list.component').then((c) => c.UserListComponent),
        canActivate: [authGuard,
            roleGuard('admin')
        ]
        
    },
    {
        path: 'admin-dashboard',
        loadComponent: () => import('./components/admin-dashboard/admin-dashboard.component').then((c) => c.AdminDashboardComponent),
        canActivate: [authGuard,
            roleGuard('admin')]
        // canActivate: [adminGuard],
    },
    {
        path: 'sponsor-dashboard',
        loadComponent: () => import('./components/sponsor-dashboard/sponsor-dashboard.component').then((c) => c.SponsorDashboardComponent),
        canActivate: [authGuard]
        
    },
];
