import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule }    from '@angular/http';
import { RouterModule }   from '@angular/router';
import { FormsModule }   from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';


import {MdListModule, MdToolbarModule, MdIconModule, MdCardModule, MdButtonModule, MdProgressSpinnerModule, MdSidenavModule, MdInputModule, MdCheckboxModule, MdDialogModule, MdProgressBarModule} from '@angular/material';
import {GoTopButtonModule} from 'ng2-go-top-button';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';


import { AppComponent } from './app.component';
import { LoginComponent } from './login.component';
import { PostsComponent, PostEditDialog, PostImageDialog } from './posts.component';
import { NewPostComponent } from './new-post.component';
import { UsersComponent } from './users.component';
import { SpinnerComponent } from './spinner.component';

import { PostService } from './post.service';
import { LoginService, LoggedIn } from './login.service';
import { UserService } from './users.service';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PostsComponent,
    PostImageDialog,
    PostEditDialog,
    NewPostComponent,
    UsersComponent,
    SpinnerComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    HttpClientModule,
    RouterModule.forRoot([
      {
        path: 'login',
        component: LoginComponent,
        canActivate: [LoggedIn]
      },
      {
        path: 'posts',
        component: PostsComponent
      },
      {
        path: 'users',
        component: UsersComponent,
        canActivate: [LoggedIn]
      },
      {
        path: '',
        redirectTo: '/posts',
        pathMatch: 'full'
      },
    ]),
    BrowserAnimationsModule,
    GoTopButtonModule,
    MdListModule,
    MdToolbarModule,
    MdIconModule,
    MdCardModule,
    MdButtonModule,
    MdProgressSpinnerModule,
    MdSidenavModule,
    MdInputModule,
    MdCheckboxModule,
    MdDialogModule,
    MdProgressBarModule
  ],
  providers: [PostService, LoginService, LoggedIn, UserService],
  bootstrap: [AppComponent],
  entryComponents: [
      PostEditDialog,
      PostImageDialog
  ]
})
export class AppModule { }
