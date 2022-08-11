// Imports

const models = require('../models');
const bcrypt = require('bcrypt');
const jwtUtils = require('../utils/jwt.utils');
const validator = require('validator');

// Routes

module.exports = {
    register: (req, res) => {
        let firstname = req.body.firstname;
        let lastname = req.body.lastname;
        let email = req.body.email;
        let password = req.body.password;
        let bio = req.body.bio;
        if (firstname == "" || lastname == "" || email == "" || password == "") {
            return res.status(400).json({ "error": "Missing Info" });
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json({ "error": "invalid email" });   
         }
        models.Users.findOne({
            attributes: ["email"] ,
            where: { email: email }
        })
        .then(function(userFound) {
            if (!userFound) {
                bcrypt.hash(password, 5, function(error, bcryptedPassword) {
                    let newUser = models.Users.create({
                        firstname: firstname,
                        lastname: lastname,
                        email: email,
                        password: bcryptedPassword,
                        bio: bio,
                        isAdmin: 0
                    })
                    .then(function(newUser) {
                        return res.status(201).json({ "success": "user added", "userId": newUser.id });
                    })
                    .catch(function(error) {
                        return res.status(500).json({ "error": "cannot add user" });
                    })
                })
            } else {
                return res.status(409).json({ "error": "user already exists" });
            }
        })
        .catch(function(error) {
            return res.status(500).json({ "error": "unable to verify user" });
        })
    },

    login: (req, res) => {
        let email = req.body.email;
        let password = req.body.password;

        if (email == "" || password == "") {
            return res.status(400).json({ "error": "one or more fields are empty"});
        }
        models.Users.findOne({
            where: { email: email }
        })
        .then(function(userFound) {
            if (userFound) {
                bcrypt.compare(password, userFound.password, function(errorBcrypt, resBcrypt) {
                    if(resBcrypt) {
                        return res.status(200).json({ "userId": userFound.id, "first name": userFound.firstname, "token": jwtUtils.generateTokenForUser(userFound) });
                    } else {
                        return res.status(403).json({ "error": "invalid password" });
                    }
                })
            } else {
                return res.status(404).json({ "error": "user not found" });
            }
        })
        .catch(function(error) {
            return res.status(500).json({ "error": "unable to verify user" });
        })

    },

    update: (req, res) => {
        let headerAuth = req.headers['authorization'];
        let userId = jwtUtils.getUserId(headerAuth);
        let bio = req.body.bio;

        models.Users.findOne({
            attributes: ["id", "bio"],
            where: { id : userId }
        })
        .then(function(userFound) {
            if (userFound) {
                userFound.update({
                    bio: (bio ? bio : userFound.bio)
                })
                return res.status(201).json({ "success": "Your bio has been updated" });
            } else {
                // a modifier quand la sécurité id = id sera en place en 503 invalid user
                return res.status(404).json({ "error": "user not found" });
                // ----------------------------------------------------------------------
            }
        })
        .catch(function(error) {
            return res.status(500).json({ "error": "unable to verify user" });
        })
    },

    delete: (req, res) => {
        let headerAuth = req.headers['authorization'];
        let userId = jwtUtils.getUserId(headerAuth);

        models.Users.findOne({
            where: { id : userId }
        })
        .then(function(userFound) {
            if (userFound) {
                models.Users.destroy({
                    where: { id : userId }
                })
                return res.status(200).json({ "success": "The user has been deleted" });
            } else {
                // a modifier quand la sécurité id = id sera en place en 503 invalid user
                return res.status(404).json({ "error": "user not found" });
                // ----------------------------------------------------------------------
            }
        })
        .catch(function(error) {
            return res.status(500).json({ "error": "unable to verify user"});
        })
    },

    getUsersAll: (req, res) => {
        let headerAuth = req.headers['authorization'];
        let userId = jwtUtils.getUserId(headerAuth);

        models.Users.findOne({
            where: { id : userId }
        })
        .then(function(userFound) {
            if (userFound) {
                models.Users.findAll({
                    attributes: ["id", "email", "firstname", "lastname", "bio"]
                })
                .then(function(usersFound) {
                    return res.status(200).json({ usersFound });
                })
                .catch(function(error) {
                    return res.status(404).json({ "error": "no users found" });
                })
            } else {
                return res.status(503).json({ "error": "invalid user" });
            }
        })
         .catch(function(error) {
             return res.status(500).json({ "error": "unable to verify user" });
         })
    },

    // to do : ajouter la sécurité qu'il faille etre logged in pour afficher un user profile
    getUsersByID: (req, res) => {
        let userId = req.params.id;
        models.Users.findOne({
            attributes: ["id", "email", "firstname", "lastname", "bio"],
            where: { id : userId }
        })
        .then(function(userFound) {
            if(userFound) {               
            return res.status(200).json({ userFound })
        } else {
            return res.status(404).json({ "error": "user not found" });
        }
        })
        .catch(function(error) {
            return res.status(500).json({ "error": "cannot fetch user" });
        })    
    },

    getUsersProfile: (req, res) => {
        let headerAuth = req.headers['authorization'];
        let userId = jwtUtils.getUserId(headerAuth);
        if (userId < 0) {
            return res.status(400).json({ "error": "wrong token" });
        }

        models.Users.findOne({
            attributes: ["id", "email", "firstname", "lastname", "bio"],
            where: { id : userId }
        })
        .then(function(user) {
            if (user) {
                return res.status(201).json(user);
            } else {
                return res.status(404).json({ "error": "user not found" });
            }
        })
        .catch(function(error) {
            return res.status(500).json({ "error": "cannot fetch user" });
        })
    }
};