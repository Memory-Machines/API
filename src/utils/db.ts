import mongoose from 'mongoose';

const connectDb = () => {
  return mongoose.connect(process.env.MONGO_ATLAS_CONNECTION, {
    useNewUrlParser: true,
    dbName: 'dev',
    keepAlive: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });
};

//we can either make the connection here and export the connection
//OR export the connect function and actually connect in the server
//it looks like it is common/best practice to connect in the server file
export { connectDb };
