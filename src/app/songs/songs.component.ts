import { Component, OnInit, Inject } from '@angular/core';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatCheckboxChange, PageEvent,
MatAutocompleteSelectedEvent } from '@angular/material';

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

    KEYS = ['artist', 'title', 'album', 'track', 'year', 'genre'];

    songs: Song[];
    songsTemp: Song[];

    loading = true;
    newState = false;
    allChecked = false;

    multiChangeSongs: Array<string> = [];

    private autocompleteValues = {};
    autocompleteShownValues = {};

    filterTimer:any = 0;
    activeFilters = [];

    defaultPageSize = 5;
    totalLength = 999; // mock-length
    private paginationObj = {
        limit: this.defaultPageSize,
        skip: 0
    };

    step = 1;

    private getSongs(): void {
        const query = this.prepareQuery();
        this.songService.getSongs(query).then((res: Song[]) => {
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

    private getCount(): void {
        this.songService.countSongs(this.prepareQuery()).then(res => {
            this.totalLength = res;
        });
    }

    private getAutocompletes(): void {
        this.songService.getAutocompletes().then(res => {
            this.autocompleteValues = res;
            this.autocompleteShownValues = Object.assign({}, this.autocompleteValues);
        });
    }

    private prepareQuery(): Object {
        let query = {};
        this.activeFilters.forEach(filter => {
            query[filter.property] = filter.currentQuery;
        });
        return Object.assign(query, this.paginationObj);
    }

    ngOnInit(): void {
        this.performFiltering();
        this.getAutocompletes();
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
                this.performFiltering();
                this.getAutocompletes();
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
        let inputArray: Array<Element> = Array.prototype.slice.call(songRow.querySelectorAll('input'));
        if (event.checked) {
            const song = this.songs.find(song => song._id == songRow.classList[1]);
            this.multiChangeSongs.push(song._id);
            for (let input of inputArray)
                input.setAttribute('disabled', 'true');
            songRow.querySelector('button').setAttribute('disabled', 'true');
        } else {
            this.multiChangeSongs = this.multiChangeSongs.filter(songId =>
                songId != songRow.classList[1]);
            for (let input of inputArray)
                input.removeAttribute('disabled');
            songRow.querySelector('button').removeAttribute('disabled');
        }
    }

    checkAll(event: MatCheckboxChange): void {
        const songsRows: Array<Element> = Array.prototype.slice.call(document.querySelectorAll('.song-row'));
        if(event.checked) {
            this.multiChangeSongs = this.songsTemp.map(song => song._id);
            for(const songRow of songsRows) {
                let inputArray: Array<Element> = Array.prototype.slice.call(songRow.querySelectorAll('input'));
                for (let input of inputArray)
                    input.setAttribute('disabled', 'true');
                songRow.querySelector('button').setAttribute('disabled', 'true');
            }
        } else {
            this.multiChangeSongs = [];
            for(const songRow of songsRows) {
                let inputArray: Array<Element> = Array.prototype.slice.call(songRow.querySelectorAll('input'));
                for (let input of inputArray)
                    input.removeAttribute('disabled');
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
            this.performFiltering();
            this.getAutocompletes();
        });
    }

    pagination(event: PageEvent): void {
        this.paginationObj = {
            limit: event.pageSize,
            skip: event.pageIndex * event.pageSize
        };
        this.loading = true;
        this.multiChangeSongs = [];
        this.getSongs();
    }

    filterAutocomplete(key: string, query: string): void {
        const pattern = new RegExp(query, 'i');
        this.autocompleteShownValues[key] = this.autocompleteValues[key]
        .filter(value => pattern.test(value));
    }

    selectAuto(event: MatAutocompleteSelectedEvent, target: HTMLInputElement): void {
        const query = event.option.value;
        const key = target.placeholder.toLowerCase();
        this.search(key, query);
        target.blur();
    }

    searchInput(key: string, event: any): void {
        clearTimeout(this.filterTimer);
        const NON_INPUT_KEYSCODES = [9, 13, 16, 17, 27, 144, 18, 20, 42, 36, 35,
            33, 34, 91, 123, 122, 121, 120, 119, 118, 117, 116, 115, 114, 113,
            112, 37, 38, 39, 40, 225];
        if (NON_INPUT_KEYSCODES.some(keycode => keycode === event.keyCode))
            return;
        else
            this.filterTimer = setTimeout(() => {
                this.search(key, event.target.value);
            }, 500);
    }


    search(key: string, query: string): void {
        const specificFilter = this.activeFilters.find(filter => filter.property === key);
        query = query.trim();
        if (!specificFilter) {
            this.activeFilters.push({
                property: key,
                currentQuery: query
            });
        } else {
            specificFilter.currentQuery = query;
            if (!query.length) {
                const index = this.activeFilters.indexOf(specificFilter);
                this.activeFilters.splice(index, 1);
            }
        }
        this.loading = true;
        this.performFiltering();
        this.filterAutocomplete(key, query);
    }

    private performFiltering(): void {
        this.paginationObj.skip = 0;
        this.getSongs();
        this.getCount();
    }

    resetInput(target: HTMLInputElement, key: string): void {
        clearTimeout(this.filterTimer);
        target.value = '';
        target.blur();
        this.loading = true;
        this.activeFilters = this.activeFilters.filter(filter =>
            filter.property != key);
        this.autocompleteShownValues = Object.assign({}, this.autocompleteValues);
        this.performFiltering();
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
