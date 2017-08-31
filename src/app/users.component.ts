import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { UserService } from './users.service';

@Component({
  selector: 'users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  providers: [UserService]
})
export class UsersComponent implements OnInit{
    constructor(private fb: FormBuilder, private userService: UserService) {
        this.createForm();
    }
    newUser: string;
    userForm: FormGroup;

    createForm() {
        this.userForm = this.fb.group({
            username: ['', [Validators.required, Validators.maxLength(60)]],
            password: ['', Validators.required],
            superAdmin: false
        });
    }

    ngOnInit(): void {

    }

    onSubmit(): void {
        let form = this.userForm;
        if(!form.valid) return;
        let user = {
            username: form.get('username').value,
            password: form.get('password').value,
            superAdmin: !!form.get('superAdmin').value,
        }
        this.userService.createUser(user).then((res)=>{
            console.log(res);
        }).catch((err)=>{
            console.log(err)
        });
        form.reset();
    }

}
