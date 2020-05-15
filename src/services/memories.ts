import { Memory } from '../repositories';
import { mb } from '../types';

async function createMemory(data: mb.Memory): Promise<mb.Memory.MemoryDoc> {
  try {
    // const memory = {
    //   user: data.user,
    //   song: data.song,
    //   text: data.text,
    //   tags: data.tags,
    //   createdBy: data.createdBy,
    // };
    const result = await Memory.saveNewMemoryToDb(data);
    return result;
  } catch (e) {
    console.error('memoryService::createMemory', e);
    throw e;
  }
}

export { createMemory };
