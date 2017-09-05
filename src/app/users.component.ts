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
    loading: boolean = true;
    users: Array<Object>

    createForm() {
        this.userForm = this.fb.group({
            username: ['', [Validators.required, Validators.maxLength(60)]],
            password: ['', Validators.required],
            superAdmin: false
        });
    }

    ngOnInit(): void {
        this.userService.getUsers().then((res)=>{
            this.users = res;
            this.loading=false;
        }).catch((err)=>console.log(err));
        // setTimeout(()=>{this.loading=false},2000);
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

    delete(user): void {
        if(confirm('Sure?'))
            this.userService.deleteUser(user.id).then(res=>{
                this.users.splice(this.users.indexOf(user),1);
            }).catch(err=>console.log(err));
    }

}
