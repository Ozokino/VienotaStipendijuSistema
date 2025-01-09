import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { LoginComponent } from './components/Users/login/login.component';
import { RegisterComponent } from './components/Users/register/register.component';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "./components/navbar/navbar.component";
import { AuthService } from './services/auth.service';

@Component({
  selector: 'stipendo-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  userRole = '';
  constructor(private router: Router, private authService: AuthService) {
    
  }
  
 
  title = 'Vienotā Stipendiju Sistēma';
}
