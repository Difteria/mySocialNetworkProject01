// Imports

const models = require('../models');
const jwtUtils = require('../utils/jwt.utils');
const TEXT_LIMIT = 2;

// Routes

module.exports = {
    createComment: function(req, res) {
        let headerAuth = req.headers['authorization'];
        let userId = jwtUtils.getUserId(headerAuth);

        let postId = req.params.id;
        let text = req.body.text;

        if (text == "") {
            return res.status(400).json({ "error": "missing info" });
        }
        if (text.length < TEXT_LIMIT) {
            return res.status(400).json({ "error": "invalid info" });
        }

        models.Users.findOne({
            where: { id: userId }
        })
        .then(function(userFound) {
            if (userFound) {
                models.comments.create({
                    postId: postId,
                    UserId: userFound.id,
                    text: text
                })
                .then(function(newComment) {
                    return res.status(201).json( newComment );
                })
                .catch(function(error){
                    return res.status(500).json({ "error": "cannot create comment" });
                })
            } else {
                return res.status(503).json({ "error": "invalid user" });
            }
        })
        .catch(function(error) {
            return res.status(500).json({ "error": "unable to verify user" });
        })

    },

    updateComment: function(req, res) {
        let headerAuth = req.headers['authorization'];
        let userId = jwtUtils.getUserId(headerAuth);

        // let postId = req.params.id;
        let commentId = req.params.comId;
        let text = req.body.text;

        models.Users.findOne({
            where: { id : userId }
        })
        .then(function(userFound) {
            if (userFound) {
                // models.posts.findOne({
                //     attributes: ["id", "userId", "title", "text"],
                //     where: { id: postId }
                // })
                models.comments.findOne({
                    attributes: ["id", "userId", "text"],
                    where: { id: commentId }
                })
                .then(function(commentFound) {
                    if (userFound.id == commentFound.dataValues.userId) {
                        commentFound.update({
                            text: ( text ? text : commentFound.text )
                        })
                        return res.status(201).json({ "success": "your comment has been updated" });
                    } else {
                        return res.status(503).json({ "error": "you don't have the rights to update this comment" });
                    }
                })
                .catch(function(error) {
                    return res.status(404).json({ "error": "comment not found" });
                })
            } else {
                return res.status(503).json({ "error": "invalid user" });
            }
        })
        .catch(function(error) {
            return res.status(500).json({ "error": "unable to verify user" });
        })
    },

    deleteComment: function(req, res) {
        let headerAuth = req.headers['authorization'];
        let userId = jwtUtils.getUserId(headerAuth);

        // let postId = req.params.id;
        let commentId = req.params.comId;

        models.Users.findOne({
            where: { id: userId }
        })
        .then(function(userFound) {
            if (userFound) {
                // models.posts.findOne({
                //     attributes: ["id", "userId", "title", "text"],
                //     where: { id: postId }
                // })
                models.comments.findOne({
                    attriubtes: ["id", "userId", "text"],
                    where: { id: commentId }
                })
                .then(function(commentFound) {
                    if (userFound.id == commentFound.dataValues.UserId) {
                        models.comments.destroy({
                            where: { id: commentId }
                        })
                        return res.status(200).json({ "success": "Your comment has been deleted" });
                    } else {
                        return res.status(503).json({ "error": "you don't have the rights to delete this comment" });
                    }
                })
                .catch(function(error) {
                    return res.status(404).json({ "error": "comment not found" });
                })
            } else {
                return res.status(503).json({ "error": "invalid user" });
            }
        })
        .catch(function(error) {
            return res.status(500).json({ "error": "unable to verify user" });
        })
    },

    listComments: function(req, res) {
        let headerAuth = req.headers['authorization'];
        let userId = jwtUtils.getUserId(headerAuth);

        // let postId = req.params.id;

        models.Users.findOne({
            where: { id : userId }
        })
        .then(function(userFound) {
            if (userFound) {
                // models.posts.findOne({
                //     attributes: ["id", "userId", "title", "text"],
                //     where: { id: postId }
                // })
                models.comments.findAll({
                    attributes: ["id", "userId", "text"],
                })
                .then(function(comments) {
                    // console.log(comments[0].dataValues.userId);
                    // for (let i=0; i <= comments.length -1; i++) {
                    //     models.Users.findOne({
                    //         attributes: ["id", "firstname", "lastname"],
                    //         where: { id: comments[i].dataValues.userId }
                    //     })
                    //     .then(function(comUser) {
                    //         if (comUser) {
                    //             comments[i].dataValues["firstname"] = comUser.dataValues.firstname;
                    //             comments[i].dataValues["lastname"] = comUser.dataValues.lastname;
                    //         } else {
                    //             return res.status(500).json({ "error": "unable to verify data"});
                    //         }
                    //         console.log('____________________',comments,'___________________________');
                    //     })
                    //     .catch(function(error) {
                    //         return res.status(500).json({ "error": "unable to verify data" });
                    //     })
                    // }
                    // console.log('-----------------------------------------',comments,'------------------------------------------');
                    return res.status(200).json( comments );
                })
                .catch(function(error) {
                    return res.status(404).json({ "error": "no comments found for this post" });
                })
            } else {
                return res.status(503).json({ "error": "invalid user" });
            }
        })
        .catch(function(error) {
            return res.status(500).json({ "error": "unable to verify user" });
        })
    }
}