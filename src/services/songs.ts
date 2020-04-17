import { Song } from '../repositories';

interface Song {
  title: string;
  artist: string;
  user: string;
  year: number;
  SpotifyLink: string;
  youTubeLink: string;
  favorite: string;
}

async function storeSong(data: Song) {
  const song = {
    title: data.title,
    artist: data.artist,
    user: data.user,
    year: data.year,
    SpotifyLink: data.SpotifyLink,
    youTubeLink: data.youTubeLink,
    favorite: data.favorite,
  };
  const result = await Song.saveNewSongToDb(song);
  return result;
}

export { storeSong };
