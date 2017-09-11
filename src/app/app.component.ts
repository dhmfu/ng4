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
    showButton = false;

    ngOnInit(): void {
        this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                this.user = JSON.parse(localStorage.getItem('user')) || {username: 'Guest'};
                //keep user up-to-date everytime route changes
            }
        });

        document.querySelector('.mat-sidenav-content').addEventListener('scroll', (event: any)=> {
            let pseudoWindow: Element = event.target;
            let scrolled = (pseudoWindow.scrollTop/pseudoWindow.scrollHeight)*100;
            if (scrolled>=17)
                this.showButton = true;
            else this.showButton = false;
        });

    }

    scrollTo(): void {
        document.querySelector('.mat-sidenav-content').scrollTop = 0;
    }

    logout(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.user = {username: 'Guest'};
        this.router.navigate(['login']);
    }
}
