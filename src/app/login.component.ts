import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { LoginService } from './login.service';
@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [LoginService]
})
export class LoginComponent implements OnInit{
    constructor(
        private loginService: LoginService,
        private fb: FormBuilder,
        private router: Router
    )
    {
        this.createForm();
    }

    loginForm :  FormGroup;
    showPassword: boolean = false;

    createForm() {
        this.loginForm = this.fb.group({
            username:  ['', Validators.required],
            password: ['', Validators.required]
        });
    }


    ngOnInit(): void {
        // console.log(localStorage.getItem('token'));
    }

    onSubmit(): void {
        let form = this.loginForm;
        if(!form.valid) return;
        this.loginService.login({name: form.get('username').value, password: form.get('password').value})
        .then(res => {
            console.log(res);
            console.log(atob(res.token.split('.')[1]));
            var user = atob(res.token.split('.')[1]);
            localStorage.setItem('user', user);
            localStorage.setItem('token', res.token);
            this.router.navigate(['posts']);
        })
        .catch(err => {
            console.log(err);
        });
    }

}
