interface SongInterface {
    artist: string;
    album: string;
    title: string;
    track: string;
    date: string;
    genre: string;
    filename: string;
};

const KEYS = ['artist', 'title', 'album', 'track', 'year', 'genre', 'filename'];

export class Song implements SongInterface{
    artist: string;
    album: string;
    title: string;
    track: string;
    date: string;
    genre: string;
    filename: string;

    constructor(song: SongInterface) {
        KEYS.forEach(key => {
            this[key] = song[key] || 'unknown';
        });
    }
}
