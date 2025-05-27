const express = require("express");
const Favorite = require("../models/Favorite");
const User = require("../models/User");
const Comic = require("../models/Comic");
const db = require("../config/db");
const router = express.Router();

router.post("/addFavorite", async (req, res) => {
  const { user_id, komik_id } = req.body;

  if (!user_id || !komik_id) {
    return res
      .status(400)
      .json({ status: "FAILED", message: "Missing fields" });
  }

  db.Types.ObjectId.isValid(user_id) && db.Types.ObjectId.isValid(komik_id)
    ? null
    : res.status(400).json({ status: "FAILED", message: "Invalid ID format" });

  User.find({ user_id })
    .then((result) => {
      if (!result) {
        return res.json({
          status: "FAILED",
          message: "User not found",
        });
      }
    })
    .catch((err) => {
      console.error(err);
      res.json({
        status: "FAILED",
        message: "Invalid ID format or User not found",
      });
    });
  Comic.find({ komik_id })
    .then((result) => {
      if (!result) {
        return res.json({
          status: "FAILED",
          message: "Komik not found",
        });
      }
    })
    .catch((err) => {
      console.error(err);
      res.json({
        status: "FAILED",
        message: "Invalid ID format or Komik not found",
      });
    });

  const existingFavorite = await Favorite.findOne({ user_id, komik_id });
  if (existingFavorite) {
    return res
      .status(400)
      .json({ status: "FAILED", message: "Favorite already exists" });
  }
  const newFavorite = new Favorite({
    user_id,
    komik_id,
  });
  res.json({
    status: "SUCCESS",
    message: `Favorite added`,
    data: newFavorite,
  });
  await newFavorite.save();
});

// router.get("/getFavorites/:user_id", async (req, res) => {
//   const { user_id } = req.params;

//   if (!user_id) {
//     return res.status(400).json({ status: "FAILED", message: "Missing fields" });
//   }

//   db.Types.ObjectId.isValid(user_id)
//     ? null
//     : res.status(400).json({ status: 'FAILED', message: 'Invalid ID format' });

//   Favorite.find({ user_id })
//     .populate('komik_id')
//     .then(result => {
//       if (result.length === 0) {
//         return res.json({
//           status: 'FAILED',
//           message: 'No favorites found',
//         });
//       }
//       res.json({
//         status: 'SUCCESS',
//         message: 'Favorites found',
//         data: result,

//       });
//     })
//     .catch(err => {
//       console.error(err);
//       res.json({
//         status: 'FAILED',
//         message: 'Error fetching favorites',
//       });
//     });
// });

router.get("/getFavorites/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;

    if (!user_id) {
      return res
        .status(400)
        .json({ status: "FAILED", message: "Missing fields" });
    }

    if (!db.Types.ObjectId.isValid(user_id)) {
      return res.status(400).json({ status: "FAILED", message: "Invalid ID format" });
    }

    const result = await Favorite.find({ user_id });

    const data = await Promise.all(
      result.map(async (favorite) => {
        const komik = await Comic.findById(favorite.komik_id);
        return {
          _id: favorite._id,
          user_id: favorite.user_id,
          komik_id: favorite.komik_id,
          komik_title: komik ? komik.title : "Unknown",
          komik_cover: komik ? komik.cover : "Unknown",
          create_at: favorite.create_at,
        };
      })
    );

    res.json({
      status: "SUCCESS",
      message: "Favorites found",
      data,
    });
  } catch (err) {
    console.error(err);
    res.json({
      status: "FAILED",
      message: "Error fetching favorites",
    });
  }
});

router.get("/getFavorites/:user_id/:komik_id", async (req, res) => {
  const { user_id, komik_id } = req.params;

  if (!user_id || !komik_id) {
    return res
      .status(400)
      .json({ status: "FAILED", message: "Missing fields" });
  }

  db.Types.ObjectId.isValid(user_id) && db.Types.ObjectId.isValid(komik_id)
    ? null
    : res.status(400).json({ status: "FAILED", message: "Invalid ID format" });

  Favorite.findOne({ user_id, komik_id })
    .populate("komik_id")
    .then((result) => {
      if (!result) {
        return res.json({
          status: "FAILED",
          message: "Favorite not found",
        });
      }
      res.json({
        status: "SUCCESS",
        message: "Favorite found",
        data: result,
      });
    })
    .catch((err) => {
      console.error(err);
      res.json({
        status: "FAILED",
        message: "Error fetching favorite",
      });
    });
});

router.delete("/removeFavorite/:user_id/:komik_id", async (req, res) => {
  const { user_id, komik_id } = req.params;

  if (!user_id || !komik_id) {
    return res
      .status(400)
      .json({ status: "FAILED", message: "Missing fields" });
  }

  db.Types.ObjectId.isValid(user_id) && db.Types.ObjectId.isValid(komik_id)
    ? null
    : res.status(400).json({ status: "FAILED", message: "Invalid ID format" });

  Favorite.findOneAndDelete({ user_id, komik_id })
    .then((result) => {
      if (!result) {
        return res.json({
          status: "FAILED",
          message: "Favorite not found",
        });
      }
      res.json({
        status: "SUCCESS",
        message: "Favorite removed",
      });
    })
    .catch((err) => {
      console.error(err);
      res.json({
        status: "FAILED",
        message: "Error removing favorite",
      });
    });
});

module.exports = router;
