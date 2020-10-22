const mongoos = require("mongoose");
const Schema = mongoos.Schema;
const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: "Product",
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
  },
});
userSchema.methods.addToCart = function (product) {
  const cartProductIndex = this.cart.items.findIndex((cp) => {
    return cp.productId.toString() === product._id.toString();
  });
  let updatedCartItems = [...this.cart.items]; // we copy all the elements
  let newQuantity = 1;
  if (cartProductIndex >= 0) {
    newQuantity = this.cart.items[cartProductIndex].quantity + 1;
    // exixsting elements
    updatedCartItems[cartProductIndex].quantity = newQuantity;
  } else {
    // new element
    updatedCartItems.push({
      productId: product._id,
      quantity: newQuantity,
    });
  }
  const updatedCart = {
    items: updatedCartItems,
  };
  this.cart = updatedCart;
  return this.save();
};
userSchema.methods.removeFromCart = function (productId) {
  const updatedCartItems = this.cart.items.filter((p) => {
    return p._id.toString() !== productId.toString();
  });

  this.cart.items = updatedCartItems;
  return this.save();
};

module.exports = mongoos.model("User", userSchema);
// const mongodb = require("mongodb");
// const { findByPk } = require("./product");
// const getDb = require("../util/database").getDb;
// class User {
//   constructor(username, email, cart, id) {
//     this.username = username;
//     this.email = email;
//     this.cart = cart; // {items : []}
//     this._id = id;
//   }
//   save() {
//     const db = getDb();
//     return db
//       .collection("users")
//       .insert(this)
//       .then((result) => console.log(result))
//       .catch((err) => console.log(err));
//   }
//   addToCart(product) {
//     const cartProductIndex = this.cart.items.findIndex((cp) => {
//       return cp.productId.toString() === product._id.toString();
//     });
//     let updatedCartItems = [...this.cart.items]; // we copy all the elements
//     let newQuantity = 1;
//     if (cartProductIndex >= 0) {
//       newQuantity = this.cart.items[cartProductIndex].quantity + 1;
//       // exixsting elements
//       updatedCartItems[cartProductIndex].quantity = newQuantity;
//     } else {
//       // new element
//       updatedCartItems.push({
//         productId: new mongodb.ObjectId(product._id),
//         quantity: newQuantity,
//       });
//     }
//     const updatedCart = {
//       items: updatedCartItems,
//     };
//     const db = getDb();
//     return db
//       .collection("users")
//       .updateOne(
//         { _id: new mongodb.ObjectId(this._id) },
//         { $set: { cart: updatedCart } }
//       );
//   }
//   getCart() {
//     const db = getDb();
//     // pour avoir un tab qui contient que les prodIds
//     const productsIds = this.cart.items.map((i) => {
//       return i.productId;
//     });
//     return db
//       .collection("products")
//       .find({ _id: { $in: productsIds } })
//       .toArray()
//       .then((products) => {
//         return products.map((p) => {
//           return {
//             ...p,
//             quantity: this.cart.items.find((i) => {
//               return i.productId.toString() === p._id.toString();
//             }).quantity,
//           };
//         });
//       })
//       .catch((err) => console.log(err));
//   }
//   deleteProductFromCart(productId) {
//     const updatedCartItems = this.cart.items.filter((p) => {
//       return p.productId.toString() !== productId.toString();
//     });
//     const db = getDb();
//     return db
//       .collection("users")
//       .updateOne(
//         { _id: new mongodb.ObjectId(this._id) },
//         { $set: { cart: { items: updatedCartItems } } }
//       );
//   }

//   addOrder() {
//     const db = getDb();
//     return this.getCart()
//       .then((products) => {
//         console.log("products are ", products);
//         const order = {
//           items: products,
//           user: {
//             _id: new mongodb.ObjectId(this._id),
//             name: this.username,
//           },
//         };
//         return db.collection("orders").insertOne(order);
//       })
//       .then((result) => {
//         this.cart = { items: [] };
//         //clear the cart in the DB
//         return db
//           .collection("users")
//           .updateOne(
//             { _id: new mongodb.ObjectId(this._id) },
//             { $set: { cart: { items: [] } } }
//           );
//       })
//       .then((result) => {})
//       .catch((err) => console.log(err));
//   }
//   getOrders() {
//     const db = getDb();
//     return db
//       .collection("orders")
//       .find({ "user._id": new mongodb.ObjectId(this._id) }) //user._id pour dir dans user on veut chercher _id
//       .toArray()
//       .then((orders) => {
//         return orders;
//       }) 
//       .catch((err) => console.log(err));
//   }
//   static findByPk(userId) {
//     const db = getDb();
//     return db
//       .collection("users")
//       .findOne({ _id: new mongodb.ObjectId(userId) })
//       .then((user) => {
//         console.log(user);
//         return user;
//       })
//       .catch((err) => console.log(err));
//   }
// }
// module.exports = User;
