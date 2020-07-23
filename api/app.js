const Joi = require('joi');
const express = require('express');
const alert = require('alert');
const app = express();

app.use(express.json());
app.use((req, res, next) => {
    res.set({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
        'Access-Control-Allow-Headers' : '*'
    });
    next();
})

// TEMPORARY MASTER DATA USER
const users = [
    { id: 1, username: 'micha', email: 'micha.hannah@gmail.com', password: 'password123' },

];





/*
*
* ROUTE HANDLER
*
*/

// GET ALL USER
app.get('/api/users', (req, res) => {

    // LOG TIME
    var datetime = new Date();
    console.log("\n"+datetime);
    console.log('User data has been retrieved.');
    return res.json(users);

});

//LOGIN
app.get('/api/users/:username/:password', (req, res) => {

    // LOG TIME
    var datetime = new Date();
    console.log("\n"+datetime);
    console.log("Incoming new GET HTTP request for LOGIN");
    console.log(req.body);

    // VALIDATE
    /*const {error} = validateUser(req.params);
    if (error) {
        console.log('Validation error');

        var jsonRespond = {
            result: "",
            message: error.details[0].message
        }

        return res.status(400).json(jsonRespond);
    }
    console.log('Validation success and accepted');*/

    // CHECK IF THE EMAIL AND PASSWORD CORRECT
    //const email_check = users.find( u => u.username === req.params.username && u.password === req.params.password );
    console.log('Check existing username: '+ req.params.username +' and password: '+req.params.password);
    const check_user = users.find( u => u.username === req.params.username && u.password === req.params.password );
    if (!check_user) {
        var error_message = 'Invalid login detail. Username or password is not correct.';
        console.log(error_message);

        var jsonRespond = {
            result: "",
            message: error_message
        }
        alert(error_message);

        return res.status(404).json(jsonRespond);
    }

    const user = {
        id: check_user.id,
        username: req.params.username,
        email: check_user.email,
        password: req.params.password
    };

    var jsonRespond = {
        result: user,
        message: "Login success"
    }
    return res.json(jsonRespond);
    console.log('Login success!');
    alert('Login success!');
});

// REGISTER NEW USER
app.post('/api/users', (req, res) => {

    // LOG TIME
    var datetime = new Date();
    console.log("\n"+datetime);
    console.log("Incoming new POST HTTP request");
    console.log(req.body);

    // VALIDATE
    const {error} = validateUser(req.body);
    if (error) {
        console.log('Validation error');

        var jsonRespond = {
            result: "",
            message: error.details[0].message
        }
        alert(error.details[0].message);

        return res.status(400).json(jsonRespond);
    }
    console.log('Validation success and accepted');

    // CHECK IF THE EMAIL ALREADY EXISTS
    console.log('Check existing email: '+req.body.email+ 'and existing username: '+req.body.email);
    const check_user = users.find( u => u.email === req.body.email || u.username === req.body.username);
    if (check_user) {
        console.log('Email: '+req.body.email+' or Username:' +req.body.username+ ' is already registered! ' );
        var jsonRespond = {
            result: "",
            message: "Registration failed. Email "+req.body.email+" or Username "+req.body.username+" is already registered. Please use other email or username."
        }
        alert('Registration failed. Email '+req.body.email+' or Username '+req.body.username+' is already registered. Please use other email or username.!');

        return res.status(404).json(jsonRespond);
    }

    console.log('Email ' + req.body.email + ' and username ' +req.body.username+ ' is available for registration');
    const user = {
        id: users.length + 1,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    };

    console.log(user);
    users.push(user);
    return res.json(user);
    console.log('Register success!');
});

//DELETE A USER
app.delete('/api/users/:id', (req, res) => {

    var datetime = new Date();
    console.log("\n"+datetime);
    console.log("Incoming new DELETE HTTP request");
    console.log(req.body);

    const user = users.find( u => u.id === parseInt(req.params.id) );
    if (!user) return res.status(404).send('ID not found.');

    const index = users.indexOf(user);
    users.splice(index, 1);
    return res.json(user);
    console.log('Delete success!');
});


const listing = [
    { id: 1, name: 'Pizza Hut', phone: '0811816611' , address: '5th Avenue' , website: 'thedir.com'  },
    { id: 2, name: 'Hard Rock Hotel', phone: '0811816612' , address: '5th Avenue' , website: 'thedir.com' },
    { id: 3, name: 'Carls Jr.', phone: '0811816613' , address: '5th Avenue' , website: 'thedir.com' },
    { id: 4, name: 'Starbucks', phone: '0811816614' , address: '5th Avenue' , website: 'thedir.com' }
];

app.get('/', (req, res) => {
    res.send('Welcome!');
})

//LIST ALL DIRECTORY
app.get("/api/listing", (req, res) => {
    return res.json(listing);
    console.log('Listing success!');
});

//LIST A DIRECTORY
app.get('/api/listing/:id', (req, res) => {

    var datetime = new Date();
    console.log("\n"+datetime);
    console.log("Incoming new GET HTTP request");
    console.log(req.body);

    const list = listing.find( l => l.id === parseInt(req.params.id) );
    if (!list) return res.status(404).send('ID not found.');
    var jsonRespond = {
        result: list,
        message: "List found!"
    }
    return res.json(jsonRespond);
    return res.json(list);
    console.log('List found!');
})

//POST A DIRECTORY
app.post('/api/listing', (req, res) => {

    var datetime = new Date();
    console.log("\n"+datetime);
    console.log("Incoming new POST HTTP request");
    console.log(req.body);

    const {error} = validateListing(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    const list = {
        id: listing.length + 1,
        name: req.body.name,
        phone: req.body.phone,
        address: req.body.address,
        website: req.body.website
    };
    courses.push(list);
    var jsonRespond = {
        result: list,
        message: "Post success!"
    }
    return res.json(jsonRespond);
    return res.json(list);
    console.log('Post success!');
});

//EDIT A DIRECTORY
app.put('/api/listing/:id', (req, res) => {

    var datetime = new Date();
    console.log("\n"+datetime);
    console.log("Incoming new PUT HTTP request");
    console.log(req.body);

    const {error} = validateListing(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    const list = listing.find( l => l.id === parseInt(req.params.id) );
    if (!list) return res.status(404).send('ID not found.');

    listing.name = req.body.name;
    listing.phone = req.body.phone;
    listing.address = req.body.address;
    listing.website = req.body.website;
    return res.json(list);
    console.log('Edit success!');
});

//DELETE A DIRECTORY
app.delete('/api/listing/:id', (req, res) => {

    var datetime = new Date();
    console.log("\n"+datetime);
    console.log("Incoming new DELETE HTTP request");
    console.log(req.body);

    const list = listing.find( l => l.id === parseInt(req.params.id) );
    if (!list) return res.status(404).send('ID not found.');

    const index = listing.indexOf(list);
    listing.splice(index, 1);
    return res.json(list);
    console.log('Delete success!');
});

function validateListing(course) {
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
        phone: Joi.string().min(10).max(14).required(),
        address: Joi.string().min(3).required(),
        website: Joi.string().min(3).uri().required(),
    });

    return schema.validate(course);
}

/*
*
* END ROUTE HANDLER
*
*/



// RUN WEB SERVER AT PORT 3000
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})

// VALIDATION FUNCTION
function validateUser(user) {
    const schema = Joi.object({
        username: Joi.string().alphanum().min(3).max(30).required(),
        email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
    });

    return schema.validate(user);
}