import { Component, OnInit } from '@angular/core';
import { Router, Event, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
    constructor(private router: Router){}

    user = JSON.parse(localStorage.getItem('user')) || {username: 'Guest'};
    showButton = false;

    ngOnInit(): void {
        this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                this.user = JSON.parse(localStorage.getItem('user')) || {username: 'Guest'};
                //keep user up-to-date everytime route changes
            }
        });

        document.querySelector('.mat-drawer-content').addEventListener('scroll', (event: any)=> {
            let pseudoWindow: Element = event.target;
            let scrolled = (pseudoWindow.scrollTop/pseudoWindow.scrollHeight)*100;
            if (scrolled>=17)
                this.showButton = true;
            else this.showButton = false;
        });

    }

    scrollTo(): void {
        document.querySelector('.mat-drawer-content').scrollTop = 0;
    }

    logout(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.user = {username: 'Guest'};
        this.router.navigate(['login']);
    }
}
