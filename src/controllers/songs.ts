import { Request, Response, NextFunction } from 'express';

import { Song } from '../services';

async function storeSong(req: Request, res: Response, next: NextFunction) {
  try {
    const { title, artist, user, year, SpotifyLink, youTubeLink, favorite } = req.body;

    const newSong = await Song.createSong({
      title,
      artist,
      user,
      year,
      SpotifyLink,
      youTubeLink,
      favorite,
    });
    res.send(newSong);
  } catch (e) {
    console.error('SongController::storeSong', e);
    res.status(500).send(e.message);
  }
}

export { storeSong };
