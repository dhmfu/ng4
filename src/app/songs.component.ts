import { Component, OnInit, Inject } from '@angular/core';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatCheckboxChange, PageEvent
} from '@angular/material';

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
    step = 1;
    loading = true;
    newState = false;
    songs: Song[];
    songsTemp: Song[];
    multiChangeSongs: Array<string> = [];
    KEYS = ['artist', 'title', 'album', 'track', 'year', 'genre'];
    AUTOCOMPLETE_KEYS = ['artist', 'album', 'year', 'genre'];
    autocompleteValues = {};
    autocompleteShownValues = {};
    allChecked = false;
    defaultPageSize = 5;
    totalLength = 999; // mock-length

    private paginationObj = {
        limit: this.defaultPageSize,
        skip: 0
    };

    private getSongs(): void {
        this.songService.getSongs(this.paginationObj).then((res: Song[]) => {
            this.songs = res;
            this.songsTemp = [];
            this.songs.forEach(song => {
                this.songsTemp.push(new Song(song));
            });
            this.loading = false;
            this.newState = false;
            this.allChecked = false;
            this.multiChangeSongs = [];
        }).catch((err) => console.log(err));
    }

    ngOnInit(): void {
        this.songService.countSongs(this.paginationObj).then(res => {
            this.totalLength = res;
        });
        this.getSongs();
        this.songService.getAutocompletes().then(res => {
            this.autocompleteValues = res;
            this.autocompleteShownValues = Object.assign({}, this.autocompleteValues);
        });
    }

    synchronize(): void {
        let songs = [];
        for (let i = 0; i < document.querySelectorAll('.changed').length; i++) {
            let song = this.songsTemp.find(song =>
                document.querySelectorAll('.changed').item(i).classList.contains(song._id)
            );
            songs.push(song);
        }
        if(songs.length) {
            this.loading = true;
            this.songService.syncSongs(songs).then(res => {
                this.getSongs();
            });
        }
    }

    markAsChanged(element: Element): void {
        this.newState = true;
        element = this.findRow(element);
        element.classList.add('changed');
    }

    reset(): void {
        document.querySelector('.changed').classList.remove('changed');
        this.songsTemp = [];
        this.songs.forEach(song => {
            this.songsTemp.push(new Song(song));
        });
        this.newState = false;
    }

    showLyrics(target: Element, song: Song): void {
        let dialogRef = this.dialog.open(LyricsDialog, {
            data: song,
            height: '80%',
            width: '30%'
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

    checkSong(event: MatCheckboxChange): void {
        let songRow = this.findRow(event.source._elementRef.nativeElement);
        let inputArray: Array<Element> = Array.prototype.slice.call(songRow.querySelectorAll('textarea'));
        if (event.checked) {
            const song = this.songs.find(song => song._id == songRow.classList[1]);
            this.multiChangeSongs.push(song._id);
            for (let textarea of inputArray)
                textarea.setAttribute('disabled', 'true');
            songRow.querySelector('button').setAttribute('disabled', 'true');
        } else {
            this.multiChangeSongs = this.multiChangeSongs.filter(songId =>
                songId != songRow.classList[1]);
            for (let textarea of inputArray)
                textarea.removeAttribute('disabled');
            songRow.querySelector('button').removeAttribute('disabled');
        }
    }

    checkAll(event: MatCheckboxChange): void {
        const songsRows: Array<Element> = Array.prototype.slice.call(document.querySelectorAll('.song-row'));
        this.allChecked = event.checked;
        if(event.checked) {
            this.multiChangeSongs = this.songsTemp.map(song => song._id);
            for(const songRow of songsRows) {
                let inputArray: Array<Element> = Array.prototype.slice.call(songRow.querySelectorAll('textarea'));
                for (let textarea of inputArray)
                    textarea.setAttribute('disabled', 'true');
                songRow.querySelector('button').setAttribute('disabled', 'true');
            }
        } else {
            this.multiChangeSongs = [];
            for(const songRow of songsRows) {
                let inputArray: Array<Element> = Array.prototype.slice.call(songRow.querySelectorAll('textarea'));
                for (let textarea of inputArray)
                    textarea.removeAttribute('disabled');
                songRow.querySelector('button').removeAttribute('disabled');
            }
        }
    }

    private findRow(element: Element): Element {
        while ((element = element.parentElement) && !element.classList.contains('song-row'));
        return element;
    }

    multiSynchronize(): void {
        const multiFields = document.querySelectorAll('.multi-field');
        let inputArray: Array<HTMLInputElement> = Array.prototype.slice.call(multiFields);
        let changeObj = {};
        for (let input of inputArray) {
            if(input.value) {
                const key = input.id.split('-')[1];
                changeObj[key] = input.value;
            }
        }
        this.loading = true;
        this.step = 1;
        this.songService.multiSync(changeObj, this.multiChangeSongs).then(res=>{
            this.getSongs();
        });
    }

    pagination(event: PageEvent): void {
        this.paginationObj = {
            limit: event.pageSize,
            skip: event.pageIndex * event.pageSize
        };
        this.loading = true;
        this.multiChangeSongs = [];
        this.allChecked = false;
        this.newState = false;
        this.songService.getSongs(this.paginationObj).then((res: Song[])=>{
            this.songs = res;
            this.songsTemp = [];
            this.songs.forEach(song => {
                this.songsTemp.push(new Song(song));
            });
            this.loading = false;
        }).catch((err) => console.log(err));
    }

    filterAutocomplete(key: string, query: string): void {
        const pattern = new RegExp(query, 'i');
        this.autocompleteShownValues[key] = this.autocompleteValues[key]
        .filter(value => pattern.test(value));
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
