import { Song } from '../models';

async function saveNewSongToDb(song: any) {
  const newSong = new Song.Model(song);
  await newSong.save();
  return newSong.toObject;
}

export { saveNewSongToDb };
