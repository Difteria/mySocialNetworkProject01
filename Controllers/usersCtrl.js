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
            return res.status(400).json({ "error": "Missing Info" })
        };
         if(!validator.isEmail(email)) {
            return res.status(400).json({ "error": "invalid email" });   
         };  
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
                        return res.status(201).json({ "success": "user added", "userId": newUser.id })
                    })
                    .catch(function(error) {
                        return res.status(500).json({ "error": "cannot add user" })
                    })
                })
            } else {
                return res.status(409).json({ "error": "user already exists" })
            }
        })
        .catch(function(error) {
            return res.status(500).json({ "error": "unable to verify user" })
        })
    },

    login: (req, res) => {
        let email = req.body.email;
        let password = req.body.password;

        if (email == "" || password == "") {
            return res.status(400).json({ "error": "one or more fields are empty"})
        }
        models.Users.findOne({
            where: { email: email }
        })
        .then(function(userFound) {
            if (userFound) {
                bcrypt.compare(password, userFound.password, function(errorBcrypt, resBcrypt) {
                    if(resBcrypt) {
                        return res.status(200).json({ "userId": userFound.id, "first name": userFound.firstname, "token": jwtUtils.generateTokenForUser(userFound) })
                    } else {
                        return res.status(403).json({ "error": "invalid password" })
                    }
                })
            } else {
                return res.status(404).json({ "error": "user not found" })
            }
        })
        .catch(function(error) {
            return res.status(500).json({ "error": "unable to verify user" })
        })

    },

    update: (req, res) => {


    },

    delete: (req, res) => {


    },

    getUsersAll: (req, res) => {
        models.Users.findAll({
            attributes: ["id", "email", "firstname", "lastname"],
         })
         .then(function(usersFound) {
             return res.status(200).json({ usersFound })
         })
         .catch(function(error) {
             return res.status(400).json({ "error": "no users found" })
         })
    },

    getUsersByID: (req, res) => {
        let userId = req.params.id;
        models.Users.findOne({
            attributes: ["id", "email", "firstname", "lastname"],
            where: { id : userId }
        })
        .then(function(userFound) {
            if(userFound) {               
            return res.status(200).json({ userFound })
        } else {
            return res.status(404).json({ "error": "user not found" })
        }
        })
        .catch(function(error) {
            return res.status(400).json({ "error": "user notnot found" })
        })    
    },

    getUsersProfile: (req, res) => {


    }
};