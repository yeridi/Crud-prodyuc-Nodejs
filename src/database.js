const mongoose = require("mongoose");
mongoose.connect('mongodb://localhost/products', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
})
 .then(db => console.log('DB is conected'))
 .catch(err => console.log(err));
