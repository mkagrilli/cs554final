// import comicsRoutes from './comics.js';
import envRoutes from './env.js';
// import userRoutes from './users.js'
import postRoutes from './posts.js'


const constructorMethod = (app) => {
    app.use('/env', envRoutes);
    app.use('/posts', postRoutes);
    app.use('*', (req, res) => {
      res.status(404).json({error: 'Route Not found'});
    });
};

export default constructorMethod;