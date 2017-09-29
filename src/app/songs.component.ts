import { Component, OnInit } from '@angular/core';

import { SongService } from './song.service';

@Component({
  selector: 'all-songs',
  templateUrl: './songs.component.html',
  styleUrls: ['./songs.component.css'],
  providers: [SongService]
})
export class SongsComponent implements OnInit{
    constructor(private songService: SongService) { }
    loading = true;
    songs: Array<any>;
    keys = ['artist', 'title', 'album', 'trackNumber', 'year', 'genre'];

    ngOnInit(): void {
        this.songService.getPosts().then((res)=>{
            this.songs = res;
            this.loading = false;
            console.log(this.songs)
        }).catch((err)=>console.log(err));
    }
}
