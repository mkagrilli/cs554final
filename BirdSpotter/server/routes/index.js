// import comicsRoutes from './comics.js';
import envRoutes from './env.js';
// import userRoutes from './users.js'
// import postRoutes from './posts.js'


const constructorMethod = (app) => {
    // app.use('/api/comics', comicsRoutes);
    app.use('/env', envRoutes);
    app.use('*', (req, res) => {
      res.status(404).json({error: 'Route Not found'});
    });
};

export default constructorMethod;
