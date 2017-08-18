import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule }    from '@angular/http';
import { RouterModule }   from '@angular/router';
import {MdListModule, MdToolbarModule, MdIconModule, MdCardModule, MdButtonModule, MdProgressSpinnerModule, MdSidenavModule} from '@angular/material';


import { AppComponent } from './app.component';
import { PostsComponent } from './posts.component';
import { SpinnerComponent } from './spinner.component';

import { PostService }          from './post.service';


@NgModule({
  declarations: [
    AppComponent,
    PostsComponent,
    SpinnerComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    RouterModule.forRoot([
      {
        path: 'posts',
        component: AppComponent
      }
    ]),
    MdListModule,
    MdToolbarModule,
    MdIconModule,
    MdCardModule,
    MdButtonModule,
    MdProgressSpinnerModule,
    MdSidenavModule
  ],
  providers: [PostService],
  bootstrap: [AppComponent]
})
export class AppModule { }
