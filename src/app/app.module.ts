import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule }    from '@angular/http';
import { RouterModule }   from '@angular/router';
import { FormsModule }   from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import {
    MatListModule, MatToolbarModule, MatIconModule, MatCardModule,
    MatButtonModule, MatProgressSpinnerModule, MatSidenavModule, MatInputModule,
    MatCheckboxModule, MatDialogModule, MatProgressBarModule, MatTableModule,
    MatSortModule, MatAutocompleteModule, MatExpansionModule, MatPaginatorModule
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { PostsComponent, PostEditDialog, PostImageDialog } from './posts/posts.component';
import { NewPostComponent } from './posts/new-post.component';
import { UsersComponent } from './users/users.component';
import { SpinnerComponent } from './additionals/spinner/spinner.component';
import { SongsComponent, LyricsDialog } from './songs/songs.component';

import { PostService } from './posts/post.service';
import { LoginService, LoggedIn } from './login/login.service';
import { UserService } from './users/users.service';
import { SongService } from './songs/song.service';

import { AppRoutingModule }     from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PostsComponent,
    PostImageDialog,
    PostEditDialog,
    LyricsDialog,
    NewPostComponent,
    UsersComponent,
    SongsComponent,
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
    MatListModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSidenavModule,
    MatInputModule,
    MatCheckboxModule,
    MatDialogModule,
    MatProgressBarModule,
    MatTableModule,
    MatSortModule,
    MatAutocompleteModule,
    MatExpansionModule,
    MatPaginatorModule
  ],
  providers: [PostService],
  bootstrap: [AppComponent],
  entryComponents: [
      PostEditDialog,
      PostImageDialog,
      LyricsDialog
  ]
})
export class AppModule { }
