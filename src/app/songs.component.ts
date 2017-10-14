import { Component, OnInit } from '@angular/core';

import { SongService } from './song.service';

import { Song } from './song';

@Component({
  selector: 'all-songs',
  templateUrl: './songs.component.html',
  styleUrls: ['./songs.component.css'],
  providers: [SongService]
})
export class SongsComponent implements OnInit{
    constructor(private songService: SongService) { }
    loading = true;
    songs: Song[];
    songsTemp: Song[];
    keys = ['artist', 'title', 'album', 'track', 'year', 'genre'];

    ngOnInit(): void {
        this.songService.getSongs().then((res: Song[])=>{
            this.songs = res;
            this.songs.sort((a, b) => a.artist.localeCompare(b.artist));
            this.songsTemp = this.songs.slice(0);
            this.loading = false;
        }).catch((err)=>console.log(err));
    }

    synchronize(): void {
        this.loading = true;
        this.songService.syncSongs(this.songsTemp).then(res=> {
            this.songs = this.songsTemp.slice(0);
            this.loading=false;
        });
    }
}
