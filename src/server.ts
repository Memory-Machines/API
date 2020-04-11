import app from './app';
import { db } from './utils';

const port = 3000;

async function initialize() {
  try {
    await db.connectDb();
    console.log('connected to database');
    app.listen(port, () => console.log(`App is listening on port ${port}`));
  } catch (e) {
    console.error('failed to initialize', e);
  }
}

initialize();
