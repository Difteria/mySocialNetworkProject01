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
        let id = req.params.id;

        let title = req.body.title;
        let text = req.body.text;

        if (title == "" || text == "") {
            return res.status(400).json({ "error": "missing info" });
        }
        if (title.length <= TITLE_LIMIT || text.length <= TEXT_LIMIT) {
            return res.status(400).json({ "error": "invalid info" });
        }

        models.Users.findOne({
            where: { id: id }
        })
        .then(function(userFound) {
            if (userFound) {
                models.posts.create({
                    title: title,
                    text: text,
                    likes: 0,
                    UserId: userFound.id
                })
                .then(function(newPost) {
                    return res.status(201).json( newPost );
                })
                .catch(function(error) {
                    return res.status(500).json({ "error": "cannot create post" });
                })
            } else {
                return res.status(404).json({ "error": "user not found" });
            }
        })
        .catch(function(error) {
            return res.status(500).json({ "error": "unable to verify user" });
        })
    },

    listPosts: function(req, res) {
        let fields = req.body.fields;
        let limit = parseInt(req.query.limit);
        let offset = parseInt(req.query.offset);
        let order = req.query.order;

        models.posts.findAll({
            order: [(order != null) ? order.split(':') : ['title', 'ASC']],
            attributes: (fields !== '*' && fields != null) ? fields.split(',') : null,
            limit: (!isNaN(limit)) ? limit: null,
            offset: (!isNaN(offset)) ? offset: null,
            include: [{
                model: models.Users,
                attributes: [ "firstname" ]
            }]
        })
        .then(function(posts) {
            if (posts) {
                return res.status(200).json( posts );
            } else {
                return res.status(404).json({ "error": "no posts found" });
            }
        })
        .catch(function(error) {
            return res.status(500).json({ "error": "invalid fields" })
        })
    }
};