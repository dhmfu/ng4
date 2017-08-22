import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


import { Post } from './post';
import { PostService } from './post.service';

@Component({
  selector: 'new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.css'],
  providers: [PostService]
})
export class NewPostComponent implements OnInit{
    constructor(private postService: PostService, private fb: FormBuilder) {
        this.createForm();
    }

    createForm() {
        this.postForm = this.fb.group({
            postText:  ['', [Validators.required, Validators.maxLength(1000)]],
        });
    }

    newPost: string;
    postForm :  FormGroup;

    ngOnInit(): void {
        // this.postService.getPosts().then(res => {
        //     this.loading = false;
        //     this.posts = res.slice(0,5);
        // })
        // .then(()=>this.posts.map((post)=>{
        //     post.avatarUrl = post.avatarUrl || '../assets/sample-avatar.png';
        //     return post;
        // }));
    }

    resizeInput(element): void {
        element.style.height = element.scrollHeight + 'px';
    }

    onSubmit(): void {
        let form = this.postForm;
        if(!form.valid) return;
        this.postService.sendPost(form.get('postText').value).then(res => console.log(res));
        //send to server
        form.reset();
    }

}
