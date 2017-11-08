import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import { HttpRequest, HttpClient, HttpEventType, HttpResponse, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';

import { Song } from './song';

@Injectable()
export class SongService {
    constructor(private http: Http, private httpClient: HttpClient) { }

    private headers = new Headers({'Content-Type': 'text/plain', 'x-access-token': localStorage.getItem('token')});

    getSongs(query: any): Promise<Song[]> {
        query = this.toQuerySting(query);
        return this.http.get('http://localhost:3000/api/songs'+query)
               .toPromise()
               .then(response => {
                   let songs: Array<any> = response.json();
                   songs = songs.map(song => new Song(song));
                   return songs;
               })
               .catch(this.handleError);
    }

    countSongs(query): Promise<number> {
        query = this.toQuerySting(query);
        return this.http.get('http://localhost:3000/api/songs/count'+query)
               .toPromise().then(response => response.json())
               .catch(this.handleError);
    }

    syncSongs(songs: Song[]): Promise<any> {
        return this.http.post('http://localhost:3000/api/songs/synchronize', songs)
               .toPromise().then(response => response).catch(this.handleError);
    }

    multiSync(changeObj, songsIds: Array<string>): Promise<any> {
        const request = {
            properties: changeObj,
            songs: songsIds
        };
        return this.http.post('http://localhost:3000/api/songs/synchronize/multiple', request)
            .toPromise().then(response => response).catch(this.handleError);
    }

    getAutocompletes(filter): Promise<Array<string>> {
        const query = this.toQuerySting(filter);
        return this.http.get('http://localhost:3000/api/songs/autocompletes'+query)
            .toPromise().then(response => response.json());
    }

    private handleError(error): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }

    private toQuerySting(query) {
        Object.keys(query).forEach(key => {
            if(typeof query[key] == 'string')
                query[key] = query[key].replace(/([[\^$.|?*+()])/g, '\\$1');
        });
        return '?' +
            Object.keys(query).map(function(key) {
                return encodeURIComponent(key) + '=' +
                    encodeURIComponent(query[key]);
                }).join('&');
    }
}
