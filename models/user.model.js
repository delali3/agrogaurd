const mongoose = require('mongoose');

const db = require('../config/db');

const { Schema } = mongoose;

    const userSchema = new Schema({
        fullname: {
            type: String,
        },
        email: {
            type: String,
        },
        phone: {
            type: String,
        },
        city: {
            type: String,
        },
        password: {
            type: String,
        },
        lat: {
            type: String,
        },
        lon: {
            type: String,
        },
    });
    
    const userModel = db.model('Users', userSchema);

    module.exports = userModel;