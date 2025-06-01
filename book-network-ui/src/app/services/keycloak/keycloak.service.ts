import {Injectable} from '@angular/core';
import Keycloak from 'keycloak-js';
import {UserProfile} from './user-profile';

@Injectable({
  providedIn: 'root'
})
export class KeycloakService {
  private _keycloak: Keycloak | undefined;

  get keycloak() {
    if (!this._keycloak) {
      this._keycloak = new Keycloak({
        url: 'http://localhost:9090',
        realm: 'book-social-network',
        clientId: 'bsn'
      });
    }
    return this._keycloak;
  }

  private _profile: UserProfile | undefined;

  get profile(): UserProfile | undefined {
    return this._profile;
  }

  async init() {
    try {
      const authenticated = await this.keycloak.init({
        onLoad: 'check-sso', // Changed from 'login-required' to 'check-sso'
        silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html'
      });

      if (authenticated) {
        this._profile = (await this.keycloak.loadUserProfile()) as UserProfile;
        this._profile.token = this.keycloak.token || '';
      }
      return authenticated;
    } catch (error) {
      console.error('Failed to initialize Keycloak', error);
      // Allow the app to continue even if Keycloak fails
      return false;
    }
  }

  login() {
    return this.keycloak.login();
  }

  logout() {
    // this.keycloak.accountManagement();
    return this.keycloak.logout({redirectUri: 'http://localhost:4200'});
  }
}
