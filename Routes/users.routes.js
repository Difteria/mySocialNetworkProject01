// Imports

const express = require('express');
const usersCtrl = require('../Controllers/usersCtrl');
const postsCtrl = require('../Controllers/postsCtrl');
const commentsCtrl = require('../Controllers/commentsCtrl');
const likesCtrl = require('../Controllers/likesCtrl');

// Routes

exports.router = (() => {
    let apiRouter = express.Router();
    
    // Users Routes

    apiRouter.route('/users/register/').post(usersCtrl.register);
    apiRouter.route('/users/login/').post(usersCtrl.login);
    apiRouter.route('/users/update/').put(usersCtrl.update);
    apiRouter.route('/users/delete/').delete(usersCtrl.delete);
    apiRouter.route('/users/getUsersAll/').get(usersCtrl.getUsersAll);
    apiRouter.route('/users/getUsersByID/:id').get(usersCtrl.getUsersByID);
    apiRouter.route('/users/getUsersProfile/').get(usersCtrl.getUsersProfile);

    // Posts Routes

    apiRouter.route('/posts/new/').post(postsCtrl.createPost);
    apiRouter.route('/posts/all/').get(postsCtrl.listPosts);
    apiRouter.route('/posts/update/:id').put(postsCtrl.updatePost);
    apiRouter.route('/posts/delete/:id').delete(postsCtrl.deletePost);

    // Comments Routes

    apiRouter.route('/posts/:id/comments/new/').post(commentsCtrl.createComment);
    apiRouter.route('/posts/:id/comments/all/').get(commentsCtrl.listComments);
    apiRouter.route('/posts/:id/comments/update/:comId').put(commentsCtrl.updateComment);
    apiRouter.route('/posts/:id/comments/delete/:comId').delete(commentsCtrl.deleteComment);

    // Likes Routes
    
    apiRouter.route('/posts/:id/likes/like').post(likesCtrl.like);
    apiRouter.route('/posts/:id/likes/unlike').post(likesCtrl.unlike);
    // apiRouter.route('/posts/:id/likes/all').get(likesCtrl.listLikes);

    return apiRouter;
})();


