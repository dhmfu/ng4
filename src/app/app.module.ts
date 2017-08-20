import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule }    from '@angular/http';
import { RouterModule }   from '@angular/router';
import {MdListModule, MdToolbarModule, MdIconModule, MdCardModule, MdButtonModule, MdProgressSpinnerModule, MdSidenavModule, MdInputModule} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';


import { AppComponent } from './app.component';
import { PostsComponent } from './posts.component';
import { NewPostComponent } from './new-post.component';
import { SpinnerComponent } from './spinner.component';

import { PostService }          from './post.service';


@NgModule({
  declarations: [
    AppComponent,
    PostsComponent,
    NewPostComponent,
    SpinnerComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    RouterModule.forRoot([
      {
        path: 'posts',
        component: PostsComponent
      },
      {
        path: 'new-post',
        component: NewPostComponent
      },
      {
        path: '',
        redirectTo: '/posts',
        pathMatch: 'full'
      },
    ]),
    BrowserAnimationsModule,
    MdListModule,
    MdToolbarModule,
    MdIconModule,
    MdCardModule,
    MdButtonModule,
    MdProgressSpinnerModule,
    MdSidenavModule,
    MdInputModule
  ],
  providers: [PostService],
  bootstrap: [AppComponent]
})
export class AppModule { }
