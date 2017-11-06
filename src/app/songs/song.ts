interface SongInterface {
    artist: string;
    album: string;
    title: string;
    track: string;
    year: string;
    genre: string;
    filename: string;
    lyrics: string;
    _id: string;
};

const KEYS = ['artist', 'title', 'album', 'track', 'year', 'genre', 'filename',
'lyrics', '_id'];

export class Song implements SongInterface{
    artist: string;
    album: string;
    title: string;
    track: string;
    year: string;
    genre: string;
    filename: string;
    lyrics: string;
    _id: string;

    constructor(song: SongInterface) {
        KEYS.forEach(key => {
            this[key] = song[key] || '';
        });
    }
}