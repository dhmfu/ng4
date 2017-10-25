import { Component, OnInit, Inject } from '@angular/core';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { SongService } from './song.service';

import { Song } from './song';

@Component({
  selector: 'all-songs',
  templateUrl: './songs.component.html',
  styleUrls: ['./songs.component.scss'],
  providers: [SongService]
})
export class SongsComponent implements OnInit{
    constructor(private songService: SongService, public dialog: MatDialog) { }
    loading = true;
    songs: Song[];
    songsTemp: Song[];
    KEYS = ['artist', 'title', 'album', 'track', 'year', 'genre'];

    ngOnInit(): void {
        this.songService.getSongs().then((res: Song[])=>{
            this.songs = res;
            this.songs.sort((a, b) => {
                if(a.artist == '') return 1;
                return a.artist.localeCompare(b.artist)
            });
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
            let song = this.songsTemp.find(song =>
                document.querySelectorAll('.changed').item(i).classList.contains(song._id)
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
        while ((element = element.parentElement) && !element.classList.contains('song-row'));
        element.classList.add('changed');
    }

    reset(): void {
        document.querySelector('.changed').classList.remove('changed');
        this.songsTemp = [];
        this.songs.forEach(song => {
            this.songsTemp.push(new Song(song));
        });
    }

    showLyrics(target: Element, song: Song): void {
        let dialogRef = this.dialog.open(LyricsDialog, {
            data: song,
            height: '80%',
            width: '50%'
        });

        dialogRef.afterClosed().subscribe((data:any)=>{
            if(data) {
                let songToFind: Song = data.song, newLyrics: string = data.lyrics;
                if(data.song.lyrics.localeCompare(newLyrics)) {
                    this.songsTemp.find(song => song == songToFind).lyrics = newLyrics;
                    this.markAsChanged(target);
                }
            }
        });
    }
}

@Component({
  selector: 'lyrics-dialog',
  templateUrl: 'lyrics-dialog.html',
  styleUrls: ['lyrics-dialog.scss']
})
export class LyricsDialog{
    song: Song;

    constructor(public dialogRef: MatDialogRef<LyricsDialog>,
    @Inject(MAT_DIALOG_DATA) public data: Song)
    {
        this.song = new Song(data);
    }

    ngOnInit(): void {
        let textarea = document.getElementById('lyricsArea');
        textarea.addEventListener('focus', (event: Event) => {
            textarea.style.height = textarea.scrollHeight + 'px';
        });
    }

    resizeInput(element): void {
        element.style.height = element.scrollHeight + 'px';
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    onYesClick(): void {
        this.dialogRef.close({song: this.data, lyrics: this.song.lyrics});
    }
}
