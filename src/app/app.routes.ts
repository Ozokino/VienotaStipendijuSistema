import { Routes } from '@angular/router';
import { loggedInGuard } from './guards/logged-in.guard';
import { authGuard } from './guards/auth.guard';
import { LoginComponent } from './components/Users/login/login.component';
import { roleGuard } from './guards/role.guard';



export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    {
        path: 'scholarship-list',
        loadComponent: () => import('./components/Scholarships/scholarship-list/scholarship-list.component').then((c) =>c.ScholarshipListComponent),
        canActivate: [authGuard]
       
    },
    {
        path: 'scholarship-user/:userId',
        loadComponent: () => import('./components/Scholarships/scholarships-user/scholarships-user.component').then((c) =>c.ScholarshipsUserComponent),
        canActivate: [authGuard,
            roleGuard(['admin', 'sponsor'])]
       
    },
    {
        path: 'applications-by-scholarship/:scholarshipId',
        loadComponent: () => import('./components/Applications/applications-by-scholarship/applications-by-scholarship.component').then((c) =>c.ApplicationsByScholarshipComponent),
        canActivate: [authGuard,
            roleGuard(['admin', 'sponsor'])]
       
    },
    {
        path: 'scholarship-details/:id',
        loadComponent: () => import('./components/Scholarships/scholarship-details/scholarship-details.component').then((c) =>c.ScholarshipDetailsComponent),
        canActivate: [authGuard]
    },
    {
        path: 'scholarship-create',
        loadComponent: () => import('./components/Scholarships/scholarship-create/scholarship-create.component').then((c) =>c.ScholarshipCreateComponent),
        canActivate: [authGuard,
            roleGuard(['admin', 'sponsor'])]
    },
    {
        path: 'application-form/:scholarshipId',
        loadComponent: () => import('./components/Applications/application-form/application-form.component').then((c) => c.ApplicationFormComponent),
        canActivate: [authGuard,
            roleGuard('student')]
      },
      {
        path: 'applications',
        loadComponent: () => import('./components/Applications/application-list/application-list.component').then((c) => c.ApplicationListComponent),
        canActivate: [authGuard,
            roleGuard('student')]
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
        path: 'admin-dashboard',
        loadComponent: () => import('./components/admin-dashboard/admin-dashboard.component').then((c) => c.AdminDashboardComponent),
        canActivate: [authGuard,
            roleGuard('admin')]

    },
  
];
