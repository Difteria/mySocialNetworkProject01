// Imports

const models = require('../models');
const jwtUtils = require('../utils/jwt.utils');

// Routes

module.exports = {
    like: function(req, res) {
        let headerAuth = req.headers['authorization'];
        let userId = jwtUtils.getUserId(headerAuth);

        let postId = req.params.id;

        if (postId <= 0) {
            return res.status(400).json({ "error (400)": "invalid parameters" });
        }

        models.posts.findOne({
            where: { id: postId }
        })
        .then(function(postFound) {
            if (postFound) {
                models.Users.findOne({
                    where: { id : userId }
                })
                .then(function(userFound) {
                    if (userFound) {
                        models.likes.findOne({
                            where: {
                                userId: userFound.id,
                                postId: postId
                            }
                        })
                        .then(function(likeFound){
                            if (!likeFound) {
                                models.likes.create({
                                        userId: userFound.id,
                                        postId: postId
                                })
                                postFound.update({
                                    likesCount: postFound.likesCount + 1
                                })
                                return res.status(201).json({ "success (201)": "you liked the post" });
                                // postFound.addUser(userFound)
                            } else {
                                return res.status(409).json({ "error (409)": "post already liked" });
                            }
                        })
                        .catch(function(error){
                            res.status(500).json({ "error (500)": "unable to find likes" });
                        })
                    } else {
                        return res.status(403).json({ "error (403)": "invalid user" });
                    }
                })
                .catch(function(error) {
                    return res.status(500).json({ "error (500)": "unable to verify user" });
                })
            } else {
                return res.status(404).json({ "error (404)": "post not found" });
            }
        })
        .catch(function(error) {
            return res.status(500).json({ "error (500)": "unable to find post" });
        })
    },

    unlike: function(req, res) {
        let headerAuth = req.headers['authorization'];
        let userId = jwtUtils.getUserId(headerAuth);

        let postId = req.params.id;

        if (postId <= 0) {
            return res.status(400).json({ "error (400)": "invalid parameters" });
        }

        models.posts.findOne({
            where: { id: postId }
        })
        .then(function(postFound) {
            if (postFound) {
                models.Users.findOne({
                    where: { id : userId }
                })
                .then(function(userFound) {
                    if (userFound) {
                        models.likes.findOne({
                            where: {
                                userId: userFound.id,
                                postId: postId
                            }
                        })
                        .then(function(likeFound){
                            if (likeFound.dataValues.userId == userFound.id) {
                                models.likes.destroy({
                                        where: { postId: postId }
                                })
                                postFound.update({
                                    likesCount: postFound.likesCount - 1
                                })
                                return res.status(200).json({ "success (200)": "you unliked the post" });
                                // postFound.addUser(userFound)
                            } else {
                                return res.status(409).json({ "error (409)": "post not liked" });
                            }
                        })
                        .catch(function(error){
                            res.status(500).json({ "error (500)": "unable to find likes" });
                        })
                    } else {
                        return res.status(403).json({ "error (403)": "invalid user" });
                    }
                })
                .catch(function(error) {
                    return res.status(500).json({ "error (500)": "unable to verify user" });
                })
            } else {
                return res.status(404).json({ "error (404)": "post not found" });
            }
        })
        .catch(function(error) {
            return res.status(500).json({ "error (500)": "unable to find post" });
        })
    },

    // listLikes: function(req, res) {

    // }
}