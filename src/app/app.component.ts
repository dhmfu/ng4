import { Component, OnInit } from '@angular/core';
import { Router, Event, NavigationEnd } from '@angular/router';


import { LoginService } from './login.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [LoginService]
})
export class AppComponent implements OnInit{
    constructor(private loginService: LoginService, private router: Router){}

    user = JSON.parse(localStorage.getItem('user')) || {username: 'Guest'};

    ngOnInit(): void {
        this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                this.user = JSON.parse(localStorage.getItem('user')) || {username: 'Guest'};
                //keep user up-to-date everytime route changes
            }
        });
    }

    logout(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.user = {username: 'Guest'};
        this.router.navigate(['posts']).then(()=>{
            window.location.reload();
        });
        // this.loginService.logout().then(response => {
        //     console.log(response);
        //     this.user = {username: 'Guest'};
        //     this.router.navigate(['posts']).then(()=>{
        //         window.location.reload();
        //     });
        // });
    }
}
