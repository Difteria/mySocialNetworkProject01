// Imports

const models = require('../models');
const jwtUtils = require('../utils/jwt.utils');
const TITLE_LIMIT = 2;
const TEXT_LIMIT = 4;

// Routes

module.exports = {
    createPost: function(req, res) {
        let headerAuth = req.headers['authorization'];
        let userId = jwtUtils.getUserId(headerAuth);

        let title = req.body.title;
        let text = req.body.text;

        if (title == "" || text == "") {
            return res.status(400).json({ "error (400)": "missing info" });
        }
        if (title.length <= TITLE_LIMIT || text.length <= TEXT_LIMIT) {
            return res.status(400).json({ "error (400)": "invalid info" });
        }

        models.Users.findOne({
            where: { id: userId }
        })
        .then(function(userFound) {
            console.log(userFound)
            if (userFound) {
                models.posts.create({
                    title: title,
                    text: text,
                    likesCount: 0,
                    userId: userFound.id
                })
                .then(function(newPost) {
                    return res.status(201).json( newPost );
                })
                .catch(function(error) {
                    return res.status(500).json({ "error (500)": "cannot create post" });
                })
            } else {
                return res.status(403).json({ "error (403)": "invalid user" });
            }
        })
        .catch(function(error) {
            return res.status(500).json({ "error (500)": "unable to verify user" });
        })
    },

    listPosts: function(req, res) {
        // let fields = req.body.fields;
        // let limit = parseInt(req.query.limit);
        // let offset = parseInt(req.query.offset);
        // let order = req.query.order;
        let headerAuth = req.headers['authorization'];
        let userId = jwtUtils.getUserId(headerAuth);

        models.Users.findOne({
            where: { id : userId }
        })
        .then(function(userFound) {
            if (userFound) {
                models.posts.findAll({
                    attributes: ["id", "userId", "title", "text", "likesCount"]
                    // order: [(order != null) ? order.split(':') : ['title', 'ASC']],
                    // attributes: (fields !== '*' && fields != null) ? fields.split(',') : null,
                    // limit: (!isNaN(limit)) ? limit: null,
                    // offset: (!isNaN(offset)) ? offset: null,
                    // include: [{
                    //     model: models.Users,
                    //     attributes: [ "firstname" ]
                    // }]
                })
                .then(function(postFound) {
                    if (postFound) {
                        return res.status(200).json( postFound );
                    } else {
                        return res.status(404).json({ "error (404)": "no posts found" });
                    }
                })
                .catch(function(error) {
                    return res.status(500).json({ "error (500)": "invalid fields" });
                })
            } else {
                return res.status(403).json({ "error (403)": "invalid user" });
            }
        })
        .catch(function(error) {
            return res.status(500).json({ "error (500)": "unable to verify user" });
        })
    },

    updatePost: function (req, res) {
        let headerAuth = req.headers['authorization'];
        let userId = jwtUtils.getUserId(headerAuth);

        let title = req.body.title;
        let text = req.body.text;
        let postId = req.params.id;

        models.Users.findOne({
            where: { id : userId }
        })
        .then(function(userFound) {
            if (userFound) {
                models.posts.findOne({
                    attributes: ["id", "userId", "title", "text"],
                    where: { id : postId }
                })
                .then(function(postFound) {
                    if (userFound.id == postFound.dataValues.userId) {
                        postFound.update({
                            title: ( title ? title : postFound.title ),
                            text: ( text ? text : postFound.text )
                        })
                        return res.status(200).json({ "success (200)": "your post has been updated" });
                    } else {
                        return res.status(403).json({ "error (403)": "you don't have the rights to update this post" });
                    }
                })
                .catch(function(error) {
                    return res.status(404).json({ "error (404)": "post not found" });
                })
            } else {
                return res.status(403).json({ "error (403)": "invalid user" });
            }
        })
        .catch(function(error) {
            return res.status(500).json({ "error (500)": "unable to verify user" });
        })
    },

    deletePost: function(req, res) {
        let headerAuth = req.headers['authorization'];
        let userId = jwtUtils.getUserId(headerAuth);
 
        let postId = req.params.id;

        models.Users.findOne({
            where: { id : userId }
        })
        .then(function(userFound) {
            if (userFound) {
                models.posts.findOne({
                    attributes: ["id", "userId", "title", "text"],
                    where: { id : postId }
                })
                .then(function(postFound) {
                    if(userFound.id == postFound.dataValues.userId) {
                        models.posts.destroy({
                            where: { id : postId }
                        })
                        return res.status(200).json({ "success (200)": "Your post has been deleted" });
                    } else {
                        return res.status(403).json({ "error (403)": "you don't have the rights to delete this post" });
                    }
                })
                .catch(function(error) {
                    return res.status(404).json({ "error (404)": "post not found" });
                })
            } else {
                return res.status(403).json({ "error (403)": "invalid user" });
            }
        })
        .catch(function(error) {
            return res.status(500).json({ "error (500)": "unable to verify user" });
        })
    }
};