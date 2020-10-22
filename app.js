const path = require("path");

const express = require("express");
const mongoos = require("mongoose");
const bodyParser = require("body-parser");


const errorController = require("./controllers/error");
// const mongoConnect = require("./util/database").mongoConnect;

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

const User = require("./models/user");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findById("5f150949ff61282014ecbdf2")
    .then((user) => {
      // req.user = new User(user.name, user.email, user.cart, user._id); // pour avoire accée au méthode qu'on a définie sur le user Model
      req.user = user;  
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoos
  .connect(
    "mongodb+srv://akramou:YlDgf4SbhQCye2lX@cluster0.kycyz.mongodb.net/shop?retryWrites=true&w=majority"
  )
  .then((result) => {
    User.findOne()
    .then(user => {
      if(!user){
        
        const newUser = new User({
          name : 'akram', 
          email : 'test@test.com', 
          cart : {
            items : []
          }
        })
        return newUser  .save(); 
      }
    })
    app.listen(3000);
  })  
  .catch((err) => console.log(err));
