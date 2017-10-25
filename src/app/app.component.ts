import { Component, OnInit } from '@angular/core';
import { Router, Event, NavigationEnd } from '@angular/router';
import * as io from 'socket.io-client';

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
        let socket = io('http://localhost:3000');
        socket.on('add song', (filename) => {
            console.log(filename);
        });

        socket.on('delete song', (filename) => {
            console.log(filename);
        });

        this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                this.user = JSON.parse(localStorage.getItem('user')) || {username: 'Guest'};
                //keep user up-to-date everytime route changes
            }
        });

        setTimeout(()=> {
            document.querySelector('.mat-sidenav-content').addEventListener('scroll', (event: any)=> {
                let pseudoWindow: Element = event.target;
                let scrolled = (pseudoWindow.scrollTop/pseudoWindow.scrollHeight)*100;
                if (scrolled>=17)
                    this.showButton = true;
                else this.showButton = false;
            });
        }, 500);


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
