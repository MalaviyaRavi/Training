const { checkout } = require("../app");
const Product = require("../models/Product");
const User = require("../models/User");

exports.getCart = function (req, res, next) {
  let isLogin = false;
  if (req.session.userid) {
    isLogin = true;
  }

  User.findOne({ _id: req.session.userid })
    .populate({
      path: "cart.items",
      populate: {
        path: "product_id",
      },
    })
    .lean()
    .then((user) => {
      let hasItem = false;
      let numOfItems = 0;

      if (user.cart.items.length > 0) {
        let totalAmount = 0;
        let itemAmount = 0;
        hasItem = true;

        for (let item of user.cart.items) {
          itemAmount = item.product_id.product_price * item.product_qty;
          totalAmount = totalAmount + itemAmount;
        }

        let cartItems = user.cart.items.map(function (item) {
          return {
            product_name: item.product_id.product_name,
            product_price: item.product_id.product_price,
            product_cart_quantity: item.product_qty,
            product_id: item.product_id._id,
            product_image: item.product_id.product_image,
          };
        });

        // for checkout
        //req.session.cartItems = cartItems;

        numOfItems = cartItems.length;

        console.log(cartItems);

        res.render("pages/product/cart", {
          title: "Your Cart",
          isLogin,
          cartItems,
          totalAmount,
          numOfItems,
          hasItem,
        });
      } else {
        res.render("pages/product/cart", {
          title: "Your Cart",
          isLogin,
          numOfItems,
          hasItem,
        });
      }
    })

    .catch((err) => {
      next(err);
    });
};

exports.getAddCart = function (req, res, next) {
  let isLogin = false;
  if (req.session.userid) {
    isLogin = true;
  }
  const product_id = req.params.product_id;
  const user_id = req.session.userid;

  User.findOne({ _id: user_id })
    .then((user) => {
      let isAlreadyInCart = hasCartProduct(product_id, user);

      if (!isAlreadyInCart) {
        user.cart.items.push({ product_id: product_id });

        const updated_user = new User(user);

        updated_user.save().then((user2) => {
          res.redirect("/");
        });
      } else {
        let cartProduct = user.cart.items.find(function (value) {
          return value.product_id == product_id;
        });

        User.updateOne(
          { _id: user_id },
          {
            $set: {
              "cart.items.$[c].product_qty": cartProduct.product_qty + 1,
            },
          },
          { arrayFilters: [{ "c.product_id": product_id }] }
        )
          .then(() => {
            res.redirect("/");
          })
          .catch((err) => {
            next(err);
          });
      }
    })
    .catch((err) => {
      next(err);
    });
};

function hasCartProduct(p_id, user) {
  let flag = false;
  for (let product of user.cart.items) {
    if (product.product_id == p_id) {
      flag = true;
    }
  }
  return flag;
}

exports.getRemoveCart = function (req, res, next) {
  let user_id = req.session.userid;
  let p_id = req.params.id;

  User.findOne({ _id: user_id })
    .populate({
      path: "cart.items",
      populate: {
        path: "product_id",
      },
    })
    .lean()
    .then((user) => {
      console.log(user.cart.items);
      let restItems = user.cart.items.filter((value) => {
        return value.product_id.id != p_id;
      });
      console.log(restItems);
      User.findOneAndUpdate({ _id: user_id }, { cart: { items: restItems } })
        .then((data) => {
          console.log(data);
          res.redirect("/user/cart");
        })
        .catch((err) => {
          next(err);
        });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getClearCart = function (req, res, next) {
  let userid = req.session.userid;

  User.findOneAndUpdate({ _id: userid }, { cart: { items: [] } })
    .then((data) => {
      res.redirect("/user/cart");
    })
    .catch((err) => {
      next(err);
    });
};

// exports.getAddCart = function (req, res, next) {
//     let isLogin = false;
//     if (req.session.userid) {
//       isLogin = true;
//     }
//     const product_id = req.params.product_id;
//     const user_id = req.session.userid;

//     User.findOne({ _id: user_id })
//       .then((user) => {
//         let isAlreadyInCart = hasCartProduct(product_id, user);

//         if (!isAlreadyInCart) {
//           user.cart.push({ product_id: product_id });

//           const updated_user = new User(user);

//           updated_user.save().then((user2) => {
//             res.redirect("/");
//           });
//         } else {
//           let cartProduct = user.cart.find(function (value) {
//             return value.product_id == product_id;
//           });

//           User.updateOne(
//             { _id: user_id },
//             { $set: { "cart.$[c].product_qty": cartProduct.product_qty + 1 } },
//             { arrayFilters: [{ "c.product_id": product_id }] }
//           )
//             .then(() => {
//               res.redirect("/");
//             })
//             .catch((err) => {
//               next(err);
//             });
//         }
//       })
//       .catch((err) => {
//         next(err);
//       });
//   };
