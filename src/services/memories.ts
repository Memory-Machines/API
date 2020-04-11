import { Memory } from '../repositories';

interface Memory {
  user: string;
  song: string;
  text: string;
  tags: Array<string>;
  createdBy: string;
}

async function createMemory(data: Memory) {
  const memory = {
    user: data.user,
    song: data.song,
    text: data.text,
    tags: data.tags,
    createdBy: data.createdBy,
  };
  const result = await Memory.saveNewMemoryToDb(memory);
  return result;
}

export { createMemory };
