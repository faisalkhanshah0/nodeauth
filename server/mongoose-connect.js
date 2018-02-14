const mongoose = require('mongoose');

mongoose.connect('mongodb://shah:shah@localhost:27017/nodeauth');
mongoose.Promise = global.Promise;


module.exports = {
    mongoose
}
