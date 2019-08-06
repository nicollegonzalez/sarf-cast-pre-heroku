const express     = require('express');
const router      = express.Router();
const bcrypt      = require('bcryptjs');
const passport    = require('passport');
const User        = require('../models/User');


/*Starting all user authentication  */
//Start signup post route
/*Using res.status() with error code and 
sending message to be displayed on the frontend 
side.*/
router.post('/signup', (req, res, next) => {
    const theUsername = req.body.username;
    const thePassword = req.body.password;
  
    if (!theUsername || !thePassword) {
      res.status(400).json({ message: 'Provide username and password' });
      return;
    }

    // if(thePassword.length < 7){
    //     res.status(400).json({ message: 'Please make your password at least 8 characters long for security purposes.' });
    //     return;
    // }
    // this is not for testing only add something like this after the featurw works correctly
  
    User.findOne({ username:theUsername }, (err, foundUser) => {

        if(err){
            res.status(500).json({message: "Username check went bad."});
            return;
        }

        if (foundUser) {
            res.status(400).json({ message: 'Username taken. Choose another one.' });
            return;
        }
  
        const salt     = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(thePassword, salt);
  
        const theNewUser = new User({
            username:theUsername,
            password: hashedPassword
        });
  
        theNewUser.save(err => {
            if (err) {
                res.status(400).json({ message: 'Saving user to database went wrong.' });
                return;
            }
            
            // Automatically log in user after sign up
            // .login() here is actually predefined passport method
            req.login(theNewUser, (err) => {

                if (err) {
                    res.status(500).json({ message: 'Login after signup went bad.' });
                    return;
                }
            

                res.status(200).json({message: 'successfully logged in'});
            });
        });
    });
});
//End of signup post route


//Start login post route
router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, theUser, failureDetails) => {
        if (err) {
            res.status(500).json({ message: 'Something went wrong authenticating user' });
            return;
        }
    
        if (!theUser) {
            // "failureDetails" contains the error messages
            // from our logic in "LocalStrategy" { message: '...' }.
            res.status(401).json(failureDetails);
            return;
        }

        // save user in session
        req.login(theUser, (err) => {
            if (err) {
                res.status(500).json({ message: 'Session save went bad.' });
                return;
            }

            // We are now logged in (that's why we can also send req.user)
            console.log('*****', req.user);
            res.status(200).json(theUser);
        });
    })(req, res, next);
});
//End of login post route

//Start logout post route
router.post('/logout', (req, res, next) => {
    // req.logout() is defined by passport
    req.logout();
    res.status(200).json({ message: 'Log out success!' });
});
//End of logout post route



//Start getcurrentuser get route
/*this route will be our helper in checking do we have 
user in the session and who the user is.
If we are not logged in and we try to access to 
/loggedin we will get this response 
:{“message”: “Unauthorized”}.*/
router.get('/getcurrentuser', (req, res, next) => {
    // req.isAuthenticated() is defined by passport
    if (req.user) {
        res.status(200).json(req.user);
        return;
    }
    res.status(403).json({ message: 'Unauthorized' });
});
//End of getcurrentuser get route








module.exports = router;