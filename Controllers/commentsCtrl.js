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
            return res.status(400).json({ "error (400)": "missing info" });
        }
        if (text.length < TEXT_LIMIT) {
            return res.status(400).json({ "error (400)": "invalid info" });
        }

        models.Users.findOne({
            where: { id: userId }
        })
        .then(function(userFound) {
            if (userFound) {
                models.comments.create({
                    postId: postId,
                    userId: userFound.id,
                    text: text
                })
                .then(function(newComment) {
                    return res.status(201).json( newComment );
                })
                .catch(function(error){
                    return res.status(500).json({ "error (500)": "cannot create comment" });
                })
            } else {
                return res.status(403).json({ "error (403)": "invalid user" });
            }
        })
        .catch(function(error) {
            return res.status(500).json({ "error (500)": "unable to verify user" });
        })

    },

    updateComment: function(req, res) {
        let headerAuth = req.headers['authorization'];
        let userId = jwtUtils.getUserId(headerAuth);

        let postId = req.params.id;
        let commentId = req.params.comId;
        let text = req.body.text;

        if (postId <= 0) {
            return res.status(400).json({ "error (400)": "invalid parameters" });
        }

        models.posts.findOne({
            where: { id: postId }
        })
        .then(function(postFound) {
            if (postFound) {
                models.Users.findOne({
                    where: { id: userId }
                })
                .then(function(userFound) {
                    if (userFound) {
                        models.comments.findOne({
                            where: { 
                                id: commentId,
                                userId: userFound.id,
                                postId: postId
                             }
                        })
                        .then(function(commentFound) {
                            if (commentFound) {
                                if (commentFound.dataValues.userId == userFound.id) {
                                    commentFound.update({
                                        text: ( text ? text : commentFound.text )
                                    })
                                    return res.status(200).json({ "success (200)": "your comment has been updated" });
                                } else {
                                    return res.status(403).json({ "error (403)": "you don't have the rights to update this comment" });
                                }
                            } else {
                                return res.status(404).json({ "error (404)": "comment not found" });
                            }
                        })
                        .catch(function(error) {
                            return res.status(500).json({ "error (500)": "unable to find comment" });
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

    deleteComment: function(req, res) {
        let headerAuth = req.headers['authorization'];
        let userId = jwtUtils.getUserId(headerAuth);

        let postId = req.params.id;
        let commentId = req.params.comId;
        let text = req.body.text;

        if (postId <= 0) {
            return res.status(400).json({ "error (400)": "invalid parameters" });
        }

        models.posts.findOne({
            where: { id: postId }
        })
        .then(function(postFound) {
            if (postFound) {
                models.Users.findOne({
                    where: { id: userId }
                })
                .then(function(userFound) {
                    if (userFound) {
                        models.comments.findOne({
                            where: { 
                                id: commentId,
                                postId: postId
                             }
                        })
                        .then(function(commentFound) {
                            console.log(commentFound);
                            if (commentFound) {
                                if (commentFound.dataValues.userId == userFound.id) {
                                    models.comments.destroy({
                                        where: { id: commentId }
                                    })
                                    return res.status(200).json({ "success (200)": "your comment has been deleted" });
                                } else {
                                    return res.status(403).json({ "error (403)": "you don't have the rights to delete this comment" });
                                }
                            } else {
                                return res.status(404).json({ "error (404)": "comment not found" });
                            }
                        })
                        .catch(function(error) {
                            return res.status(500).json({ "error (500)": "unable to find comment" });
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

    listComments: function(req, res) {
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
                    where: { id: userId }
                })
                .then(function(userFound) {
                    if (userFound) {
                        models.comments.findAll({
                            attributes: ["id", "userId", "postId", "text", "createdAt", "updatedAt"],
                            where: { postId: postId }
                        })
                        .then(function(commentFound) {
                            console.log(commentFound);
                            if (commentFound) {
                                    return res.status(201).json({ commentFound });
                            } else {
                                return res.status(404).json({ "error (404)": "comment not found" });
                            }
                        })
                        .catch(function(error) {
                            return res.status(500).json({ "error (500)": "unable to find comment" });
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
    
        // let headerAuth = req.headers['authorization'];
        // let userId = jwtUtils.getUserId(headerAuth);

        // let postId = req.params.id;

        // models.Users.findOne({
        //     where: { id : userId }
        // })
        // .then(function(userFound) {
        //     if (userFound) {
                // models.posts.findOne({
                //     attributes: ["id", "userId", "title", "text"],
                //     where: { id: postId }
                // })
                // models.comments.findAll({
                //     attributes: ["id", "userId", "text"],
                // })
                // .then(function(comments) {
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
        //             return res.status(200).json( comments );
        //         })
        //         .catch(function(error) {
        //             return res.status(404).json({ "error": "no comments found for this post" });
        //         })
        //     } else {
        //         return res.status(503).json({ "error": "invalid user" });
        //     }
        // })
        // .catch(function(error) {
        //     return res.status(500).json({ "error": "unable to verify user" });
        // })
    }
}