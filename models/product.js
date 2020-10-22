const mongoos = require("mongoose");
const Schema = mongoos.Schema;
const productSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: {   
    type: String,
    required: true,
  },
  userId : {  
    type : Schema.Types.ObjectId, 
    ref : 'User', 
    required : true 
  }
});
module.exports = mongoos.model('Product', productSchema)

// const getDb = require("../util/database").getDb;
// const mongodb = require("mongodb");

// class Product {
//   constructor(title, price, description, imageUrl, id, userId) {
//     this.title = title;
//     this.price = price;
//     this.description = description;
//     this.imageUrl = imageUrl;
//     this._id = id ? mongodb.ObjectId(id) : null;
//     this.userId = userId;
//   }
//   save() {
//     const db = getDb();
//     let dbOp;
//     if (this._id) {
//       //updating
//       dbOp = db
//         .collection("products")
//         .updateOne({ _id: this._id }, { $set: this }); //the second argument is to tel mongoDb wich field will update    *
//     } else {
//       //insert
//       dbOp = db.collection("products").insertOne(this);
//     }
//     return dbOp
//       .then((result) => {
//         // console.log(result);
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }
//   static fetchAll() {
//     const db = getDb();
//     return db
//       .collection("products")
//       .find()
//       .toArray()
//       .then((products) => {
//         return products;
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }
//   static findByPk(prodId) {
//     const db = getDb();
//     return db
//       .collection("products")
//       .find({ _id: new mongodb.ObjectId(prodId) })
//       .next()
//       .then((product) => {
//         console.log(product);
//         return product;
//       })
//       .catch((err) => {
//         console.error(err);
//       });
//   }
//   static deleteByPk(prodId) {
//     const db = getDb();
//     return db
//       .collection("products")
//       .deleteOne({ _id: new mongodb.ObjectId(prodId) })
//       .then((result) => {
//         console.log(result);
//         console.log("Deleted !");
//       })
//       .catch((err) => console.log(err));
//   }
// }

// module.exports = Product;
