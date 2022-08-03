// Imports

const express = require('express');
const usersCtrl = require('../Controllers/usersCtrl');

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

    return apiRouter;
})();


