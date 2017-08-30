import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule }    from '@angular/http';
import { RouterModule }   from '@angular/router';
import { FormsModule }   from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';  // <-- #1 import module

import {MdListModule, MdToolbarModule, MdIconModule, MdCardModule, MdButtonModule, MdProgressSpinnerModule, MdSidenavModule, MdInputModule, MdCheckboxModule, MdDialogModule} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';


import { AppComponent } from './app.component';
import { LoginComponent } from './login.component';
import { PostsComponent, PostEditDialog } from './posts.component';
import { NewPostComponent } from './new-post.component';
import { SpinnerComponent } from './spinner.component';

import { PostService } from './post.service';
import { LoginService, LoggedIn } from './login.service';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PostsComponent,
    PostEditDialog,
    NewPostComponent,
    SpinnerComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    RouterModule.forRoot([
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'posts',
        component: PostsComponent
      },
      {
        path: 'new-post',
        component: NewPostComponent,
        canActivate: [LoggedIn]
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
    MdInputModule,
    MdCheckboxModule,
    MdDialogModule
  ],
  providers: [PostService, LoginService, LoggedIn],
  bootstrap: [AppComponent],
  entryComponents: [
      PostEditDialog
  ]
})
export class AppModule { }
