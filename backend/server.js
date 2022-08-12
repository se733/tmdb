const express = require('express');
const app = express();
const db = require('./api/db')
const cookieParser = require('cookie-parser');
const volleyball = require('volleyball');
const cors = require('cors')
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const Users = require("./api/models/Users")
const routes = require('./api/routes')
const models = require('./api/models/index')





app.use(express.json());
app.use(cookieParser())
app.use(volleyball)
// app.use(sessions({
//     secret: 'keyboard cat',
//     resave: true,
//     saveUninitialized: true,
//   }))

app.use(cors())

app.use(passport.initialize());
app.use(passport.session());

passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      function (email, password, done) {
        Users.findOne({ where: { email } })
          .then((user) => {
            // console.log("User: ", user)
            if (!user) {
              return done(null, false); // user not found
            }
            user.hash(password, user.salt).then((hash) => {
              // console.log("Existe el usuario")
              if (hash !== user.password) {
                // console.log("Contraseña incorrecta")
                return done(null, false); // invalid password
              }
              // console.log("Contraseña correcta")
              done(null, user); // success :D
            });
          })
          .catch(done);
      }
    )
  );

// How we save the user
passport.serializeUser(function (user, done) {
    // console.log("Serialize User ejectuado")
    // console.log("User: ", user.id)
    done(null, user.id);
  });
  
  // How we look for the user
  passport.deserializeUser(function (id, done) {
    // console.log("Deserialize User ejectuado")
    Users.findByPk(id).then((user) => done(null, user)).catch(error => console.log(error));
  });



  app.use('/api', routes);

  const port = 3001;
  
  db.sync({ force: false })
    .then(() => {
      app.listen(port, () => {
        console.log(`Server listening at port ${port}`);
      });
    })
    .catch((error) => console.log("Error: ", error));
