import {Component, OnInit} from '@angular/core';
import {AuthenticationRequest} from '../../services/models/authentication-request';
import {KeycloakService} from '../../services/keycloak/keycloak.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  authRequest: AuthenticationRequest = {email: '', password: ''};
  errorMsg: Array<string> = [];
  
  constructor(
    private keycloakService: KeycloakService,
    private router: Router
  ) {
  }
  
  async ngOnInit(): Promise<void> {
    try {
      await this.keycloakService.init();
      // Don't automatically redirect to login on page load
      // removed: await this.ss.login();
    } catch (error) {
      console.error('Failed to initialize Keycloak:', error);
      this.errorMsg.push('Failed to initialize authentication service');
    }
  }
  
  login() {
    this.errorMsg = [];
    try {
      this.keycloakService.login();
    } catch (err) {
      console.error('Login error:', err);
      this.errorMsg.push('Failed to log in. Please try again later.');
    }
  }
  
  register() {
    this.router.navigate(['register']);
  }
}
