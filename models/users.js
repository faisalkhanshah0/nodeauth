var { mongoose } = require('./../server/mongoose-connect');
var bcrypt = require('bcryptjs');

var Schema = mongoose.Schema;

var userSchema = new Schema({
    username : {
        type : String,
        index : true,
        required : true,
        trim : true
    },
    password : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    name : {
        type : String,
        required : true
    }

  });

var Users = mongoose.model('users', userSchema);
var createUser = (newUser, callback) => {
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            newUser.password = hash;
            newUser.save(callback);
        });
    });
}

var getUserByUsername = (username, callback) => {
    var query = {username};
    Users.findOne(query, callback);
}

var getUserById = (id, callback) => {
    
    Users.findById(id, callback);
}

var comparePassword = (password, hash, callback) => {
    bcrypt.compare(password, hash, function(err, isMatch){
        if(err)
        {
            throw err;
        }
        callback(null, isMatch);
    });
}

module.exports = {
    Users,
    createUser,
    getUserByUsername,
    comparePassword,
    getUserById
}

