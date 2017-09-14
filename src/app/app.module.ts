import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule }    from '@angular/http';
import { RouterModule }   from '@angular/router';
import { FormsModule }   from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { MdListModule, MdToolbarModule, MdIconModule, MdCardModule, MdButtonModule, MdProgressSpinnerModule, MdSidenavModule, MdInputModule, MdCheckboxModule, MdDialogModule, MdProgressBarModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { LoginComponent } from './login.component';
import { PostsComponent, PostEditDialog, PostImageDialog } from './posts.component';
import { NewPostComponent } from './new-post.component';
import { UsersComponent } from './users.component';
import { SpinnerComponent } from './spinner.component';

import { PostService } from './post.service';
import { LoginService, LoggedIn } from './login.service';
import { UserService } from './users.service';

import { AppRoutingModule }     from './app-routing.module';

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
    AppRoutingModule,
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
    MdDialogModule,
    MdProgressBarModule
  ],
  providers: [PostService],
  bootstrap: [AppComponent],
  entryComponents: [
      PostEditDialog,
      PostImageDialog
  ]
})
export class AppModule { }
