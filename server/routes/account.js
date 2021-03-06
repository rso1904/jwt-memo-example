import express from 'express';
import Account from '../models/account';
import jwt from 'jsonwebtoken';

const router = express.Router();

/*
    ACCOUNT SIGNUP: POST /api/account/signup
    BODY SAMPLE: { "username": "test", "password": "test"};
    ERROR CODES:
        1: BAD USERNAME
        2: BAD PASSWORD
        3: USERNAM EXISTS
*/

router.post('/signup', (req, res) => {
    // CEHCK USERNAME FORMAT
    let usernameRegex = /^[a-z0-9]+$/;
    
    if (!usernameRegex.test(req.body.username)) {
        return res.status(400).json({
            error: "BAD USERNAME",
            code: 1
        });
    }

    // CHECK PASS LENGTH
    if (req.body.password.length < 4 || typeof req.body.password !== "string") {
        return res.status(400).json({
            error: "BAD PASSWORD",
            code: 2
        });
    }

    // CHECK USER EXISTANCE
    Account.findOne({ username: req.body.username }, (err, exists) => {
        if (err) throw err;
        if (exists) {
            return res.status(409).json({
                error: "USERNAME EXISTS",
                code: 3
            });
        }

        let account = new Account({
            username: req.body.username,
            password: req.body.password
        });

        account.password = account.generateHash(account.password);

        // SAVE IN THE DATABASE
        account.save(err => {
            if (err) throw err;
            return res.json({ success: true });
        });
    });

   // res.json({ success: true });
});

/*
    ACCOUNT SIGNIN: POST /api/account/signin
    BODY SAMPLE: { "username": "test", "password": "test" }
    ERROR CODES:
        1: LOGIN FAILED
*/

router.post('/signin', (req, res) => {
    if (typeof req.body.password !== "string") {
        return res.status(401).json({
            error: "LOGIN FAILED",
            code: 1
        });
    }

    // FIND THE USER BY USERNAME
    Account.findOne({ username: req.body.username }, (err, account) => {
        const secret = req.app.get('jwt-secret');

        if (err) throw err;
        
        // CHECK ACCOUNT EXISTANCY
        if (!account) {
            return res.status(401).json({
                error: "LOGIN FAILED",
                code: 1
            });
        }

        // CHECK WHETHER THE PASSWORD IS VALID
        if (!account.validateHash(req.body.password)) {
            return res.status(401).json({
                error: "LOGIN FAILED",
                code: 1
            });
        }
            
        const p = new Promise((resolve, reject) => {
                jwt.sign(
                    {
                        username: req.body.username
                    }, 
                    secret, 
                    {
                        expiresIn: '7d',
                        issuer: 'velopert.com',
                        subject: 'userInfo'
                    }, (err, token) => {
                        if (err) reject(err)
                        resolve(token) 
                    });
        });
        
        // ALTER SESSION
    /*    let session = req.session;
        session.loginInfo = {
            _id: account._id,
            username: account.username
        };*/
        
        // RETURN SUCCESS
        p.then((token) => { 
            return res.json({
                success: true,
                token: token
            });
        });
    });

    //res.json({ success: true });
});

/*
    GET CURRENT USER INFO GET /api/account/getInfo
*/

router.get('/getinfo', (req, res) => {
    if (typeof req.session.loginInfo === "undefined") {
        return res.status(401).json({
            error: 1
        });
    }
    res.json({ info: req.session.loginInfo });
    //res.json({ info: null });
});

/*
    LOGOUT: POST /api/account/logout
*/

router.post('/logout', (req, res) => {
    //req.session.destroy(err => { if (err) throw err; });
    return res.json({ success: true });
});

/*
    SEARCH USER: GET /api/account/search/:username
*/
router.get('/search/:username', (req, res) => {
    // SEARCH USERNAMES THAT STARTS WITH GIVEN KEYWORD USING REGEX
    var re = new RegExp('^' + req.params.username);
    Account.find({ username: { $regex: re } }, { _id: false, username: true })
        .limit(5)
        .sort({ username: 1 })
        .exec((err, accounts) => {
            if (err) throw err;
            res.json(accounts);
        });
});

// EMPTY SEARCH REQUEST: GET /api/account/search
router.get('/search', (req, res) => {
    res.json([]);
});

// update profile
router.put('/update', (req, res) => {
    // FIND THE USER BY USERNAME
    Account.findOne({ username: req.body.data.username }, (err, account) => {
        if (err) throw err;
        /*
        if (typeof req.body.data.password !== "undefined")
            account.password = account.generateHash(req.body.password);
        */
        if (typeof req.body.data.password !== "undefined")
            account.password = account.generateHash(req.body.data.password);
        if (typeof req.body.data.email !== "undefined")
            account.email = req.body.data.email;
        if (typeof req.body.data.imagePreviewUrl !== "undefined")
            account.image = req.body.data.imagePreviewUrl;
        
        // SAVE IN THE DATABASE
        account.save(err => {
            if (err) throw err;
            return res.json({ success: true });
        });
    });
});


router.get('/profile', (req, res) => {
    
    Account.findOne({ username: req.params.username })
        .exec((err, accounts) => {
            if (err) throw err;
            res.json(accounts);
        });
});

router.get('/profile/:username', (req, res) => {
    
    Account.findOne({ username: req.params.username })
        .exec((err, accounts) => {
            if (err) throw err;
            res.json(accounts);
        });
});

export default router;