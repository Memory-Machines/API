import { Memory } from '../models';

async function saveNewMemoryToDb(memory: any) {
  const newMemory = new Memory.Model(memory);
  await newMemory.save();
  return newMemory.toObject;
}

export { saveNewMemoryToDb };
