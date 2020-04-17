import { Memory } from '../models';
import { mb } from '../types';

async function saveNewMemoryToDb(memory: mb.Memory): Promise<mb.Memory.MemoryDoc> {
  try {
    const newMemory = new Memory.Model(memory);
    await newMemory.save();
    return newMemory.toObject();
  } catch (e) {
    console.error('memoryRepository::saveNerMemoryToDb', e);
    throw e;
  }
}

export { saveNewMemoryToDb };
