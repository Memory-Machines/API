import { Document } from 'mongoose';
import { v4 } from 'uuid';

export const generateModelId = () => v4().replace(/-/g, '');
