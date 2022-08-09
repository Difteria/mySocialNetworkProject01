// Imports

const express = require('express');
const usersCtrl = require('../Controllers/usersCtrl');
const postsCtrl = require('../Controllers/postsCtrl');

// Routes

exports.router = (() => {
    let apiRouter = express.Router();
    
    apiRouter.route('/users/register/').post(usersCtrl.register);
    apiRouter.route('/users/login/').post(usersCtrl.login);
    apiRouter.route('/users/update/:id').put(usersCtrl.update);
    apiRouter.route('/users/delete/:id').delete(usersCtrl.delete);
    apiRouter.route('/users/getUsersAll/').get(usersCtrl.getUsersAll);
    apiRouter.route('/users/getUsersByID/:id').get(usersCtrl.getUsersByID);
    apiRouter.route('/users/getUsersProfile/:id').get(usersCtrl.getUsersProfile);

    apiRouter.route('/posts/new/:id').post(postsCtrl.createPost);
    apiRouter.route('/posts/all/:id').get(postsCtrl.listPosts);

    return apiRouter;
})();


