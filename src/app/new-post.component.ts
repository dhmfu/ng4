import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';
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
    @Output() onSend = new EventEmitter<Post>();

    constructor(private postService: PostService, private fb: FormBuilder) {
        this.createForm();
    }
    newPost: string;
    postForm :  FormGroup;
    postSize: number;
    loading: boolean = false;
    file;
    progress: number;

    createForm() {
        this.postForm = this.fb.group({
            postTitle: ['', [Validators.required, Validators.maxLength(1000)]],
            postText:  ['', [Validators.required, Validators.maxLength(10000)]],
            postImage: ['']
        });
    }


    ngOnInit(): void {
        this.postSize = document.getElementById('postText').clientHeight;
    }

    resizeInput(element): void {
        element.style.height = element.scrollHeight + 'px';
    }

    imageUpload(event): void {
        this.file = event.target.files[0];
    }

    onSubmit(): void {
        let form = this.postForm;
        if(!form.valid) return;
        this.loading = true;
        let changeProgressBar = (data) => this.progress = data;
        this.postService.sendPost(form.get('postText').value, form.get('postTitle').value, this.file, changeProgressBar)
        .then( (res: any) => {
            document.getElementById('postText').style.height = this.postSize + 'px';
            this.loading = false;
            form.reset();
            if(!res.errors)
                this.onSend.emit(res);
            else alert('Sorry, try later');
        });
    }

}
