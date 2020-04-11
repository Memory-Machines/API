import { Request, Response, NextFunction } from 'express';

import { Memory } from '../services';

async function appendMemory(req: Request, res: Response, next: NextFunction) {
  try {
    const { user, song, text, tags, createdBy } = req.body;

    const memory = await Memory.createMemory({
      user,
      song,
      text,
      tags,
      createdBy,
    });
    res.send(memory);
  } catch (e) {
    console.error('appendMemory::memory contorller', e);
    res.status(500).send(e.message);
  }
}

export { appendMemory };
