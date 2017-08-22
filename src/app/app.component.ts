import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { LoginService } from './login.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [LoginService]
})
export class AppComponent{
    constructor(private loginService: LoginService, private router: Router){}
    title = 'Welcome';

    logout(): void {
        this.loginService.logout().then(response => {
            console.log(response);
            this.router.navigate(['posts']);
        });
    }
}
