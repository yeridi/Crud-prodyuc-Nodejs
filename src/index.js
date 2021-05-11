const express = require ('express');
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const session = require('express-session')
const flash = require('connect-flash')
const multer = require('multer')
const { v4: uuidv4 } = require('uuid');
//inicializaciones
const app = express();
require('./database');
//setting

app.set('port',process.env.PORT | 4000);
app.set('views', path.join(__dirname, 'views')); //definiendo las vistas
app.engine('.hbs', exphbs({
    defaultLayout:'main',
    layautDir:path.join(app.get('views'),'layouts'),
    partialsDir:path.join(app.get('views'),'partials'),
    extname:'.hbs'
}));
app.set('view engine', '.hbs');

//middlewares

const storage = multer.diskStorage({
    destination: path.join(__dirname, 'public/img/uploads'),
    filename: (req, file, cb, filename) => {
        console.log(file);
        cb(null, uuidv4() + path.extname(file.originalname).toLowerCase());
    }
}) 
app.use(multer({storage}).single('images'));

app.use(express.urlencoded({extended:false}));
app.use(methodOverride('_method'));
app.use(session({
    secret:'myapp',
    resave:true,
    saveUninitialized:true
}))
app.use(flash());

//Global variables

app.use((req,res,next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
})

//Routes
app.use(require('./routes/index'));
app.use(require('./routes/product'));

//static files
app.use(express.static(path.join(__dirname,'public')));

//server starting
app.listen(app.get('port'),()=>{
    console.log("server is listening", app.get('port'));
})