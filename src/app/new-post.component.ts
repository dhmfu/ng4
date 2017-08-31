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

    createForm() {
        this.postForm = this.fb.group({
            postText:  ['', [Validators.required, Validators.maxLength(1000)]],
        });
    }


    ngOnInit(): void {
        this.postSize = document.getElementById('postText').clientHeight;
    }

    resizeInput(element): void {
        element.style.height = element.scrollHeight + 'px';
    }

    onSubmit(): void {
        let form = this.postForm;
        if(!form.valid) return;
        this.postService.sendPost(form.get('postText').value).then( (res: Post) => {
            document.getElementById('postText').style.height = this.postSize + 'px';
            this.onSend.emit(res);
            form.reset();
        });
    }

}
