import { Component, OnInit } from '@angular/core';

import { SongService } from './song.service';

import { Song } from './song';

@Component({
  selector: 'all-songs',
  templateUrl: './songs.component.html',
  styleUrls: ['./songs.component.scss'],
  providers: [SongService]
})
export class SongsComponent implements OnInit{
    constructor(private songService: SongService) { }
    loading = true;
    songs: Song[];
    songsTemp: Song[];
    KEYS = ['artist', 'title', 'album', 'track', 'year', 'genre'];

    ngOnInit(): void {
        this.songService.getSongs().then((res: Song[])=>{
            this.songs = res;
            this.songs.sort((a, b) => a.artist.localeCompare(b.artist));
            this.songsTemp = [];
            this.songs.forEach(song => {
                this.songsTemp.push(new Song(song));
            });
            this.loading = false;
        }).catch((err) => console.log(err));
    }

    synchronize(): void {
        let songs = [];
        for (let i = 0; i < document.querySelectorAll('.changed').length; i++) {
            let song = this.songsTemp.find(song => song._id ==
                document.querySelectorAll('.changed').item(i).classList[0]
            );
            songs.push(song);
        }
        if(songs.length)
            this.loading = true;
            this.songService.syncSongs(songs).then(res=> {
                this.songs = [];
                this.songsTemp.forEach(song => {
                    this.songs.push(new Song(song));
                });
                this.songs = this.songsTemp.slice(0);
                this.loading = false;
            });
    }

    markAsChanged(element: Element): void {
        element.parentElement.parentElement.classList.add('changed');
    }

    reset(): void {
        document.querySelector('.changed').classList.remove('changed');
        this.songsTemp = [];
        this.songs.forEach(song => {
            this.songsTemp.push(new Song(song));
        });
    }
}
