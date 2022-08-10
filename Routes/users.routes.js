// Imports

const express = require('express');
const usersCtrl = require('../Controllers/usersCtrl');
const postsCtrl = require('../Controllers/postsCtrl');

// Routes

exports.router = (() => {
    let apiRouter = express.Router();
    
    apiRouter.route('/users/register/').post(usersCtrl.register);
    apiRouter.route('/users/login/').post(usersCtrl.login);
    apiRouter.route('/users/update/').put(usersCtrl.update);
    apiRouter.route('/users/delete/').delete(usersCtrl.delete);
    apiRouter.route('/users/getUsersAll/').get(usersCtrl.getUsersAll);
    apiRouter.route('/users/getUsersByID/:id').get(usersCtrl.getUsersByID);
    apiRouter.route('/users/getUsersProfile/').get(usersCtrl.getUsersProfile);

    apiRouter.route('/posts/new/').post(postsCtrl.createPost);
    apiRouter.route('/posts/all/').get(postsCtrl.listPosts);
    apiRouter.route('/posts/update/:id').put(postsCtrl.updatePost);
    apiRouter.route('/posts/delete/:id').delete(postsCtrl.deletePost);

    // apiRouter.route('/comments/new/').post(commentsCtrl.createComment);
    // apiRouter.route('/comments/all/').get(commentsCtrl.listComments);
    // apiRouter.route('/comments/update/:id').put(commentsCtrl.updateComment);
    // apiRouter.route('/comments/delete/:id').delete(commentsCtrl.deleteComment);

    return apiRouter;
})();


