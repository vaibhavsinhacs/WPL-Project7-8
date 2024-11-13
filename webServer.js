// "use strict";

// const mongoose = require("mongoose");
// mongoose.Promise = require("bluebird");

// const express = require("express");
// const app = express();

// const session = require("express-session");
// const bodyParser = require("body-parser");
// const multer = require("multer");

// // Load the Mongoose schema for User, Photo, and SchemaInfo
// const User = require("./schema/user.js");
// const Photo = require("./schema/photo.js");
// const SchemaInfo = require("./schema/schemaInfo.js");

// mongoose.set("strictQuery", false);
// mongoose.connect("mongodb://127.0.0.1/project6", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// app.use(express.static(__dirname));

// app.use(session({secret: "secretKey", resave: false, saveUninitialized: false}));
// app.use(bodyParser.json());

// // Route to get SchemaInfo
// app.get("/test/:p1", async function (request, response) {
//   const param = request.params.p1 || "info";

//   if (param === "info") {
//     try {
//       const info = await SchemaInfo.find({});
//       if (info.length === 0) {
//         return response.status(500).send("Missing SchemaInfo");
//       }
//       return response.json(info[0]);
//     } catch (err) {
//       return response.status(500).json(err);
//     }
//   } else if (param === "counts") {
//     const collections = [
//       { name: "user", collection: User },
//       { name: "photo", collection: Photo },
//       { name: "schemaInfo", collection: SchemaInfo },
//     ];

//     try {
//       await Promise.all(
//         collections.map(async (col) => {
//           col.count = await col.collection.countDocuments({});
//           return col;
//         })
//       );

//       const obj = {};
//       for (let i = 0; i < collections.length; i++) {
//         obj[collections[i].name] = collections[i].count;
//       }
//       return response.json(obj);
//     } catch (err) {
//       return response.status(500).send(JSON.stringify(err));
//     }
//   } else {
//     return response.status(400).send("Bad param " + param);
//   }
// });

// // URL /user/list - Returns all the User objects needed for the navigation sidebar.
// app.get("/user/list", async function (request, response) {
//   try {
//     const users = await User.find({}, "_id first_name last_name");
//     return response.json(users);
//   } catch (err) {
//     return response.status(500).json(err);
//   }
// });

// // URL /user/:id - Returns detailed information of the user.
// app.get("/user/:id", async function (request, response) {
//   const id = request.params.id;

//   try {
//     const user = await User.findById(id, "_id first_name last_name location description occupation");
//     if (!user) {
//       return response.status(400).send("User not found");
//     }
//     return response.json(user);
//   } catch (err) {
//     return response.status(400).send("Invalid user ID provided");
//   }
// });

// // URL /photosOfUser/:id - Returns the photos of the user with _id of id.
// app.get("/photosOfUser/:id", async function (request, response) {
//   const id = request.params.id;

//   // Validate the provided ID
//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     return response.status(400).send("Invalid user ID provided");
//   }

//   try {
//     // Step 1: Fetch all users and store them in a lookup object
//     const users = await User.find({}, "_id first_name last_name").lean();
//     const userLookup = {};
//     users.forEach(user => {
//       userLookup[user._id.toString()] = {
//         first_name: user.first_name,
//         last_name: user.last_name,
//       };
//     });

//     // Step 2: Find photos of the user
//     const photos = await Photo.find({ user_id: id })
//       .populate({
//         path: 'comments.user_id', // Ensure this is correct if still using populate
//         select: '_id' // We can keep it minimal since we won't be using the full user document here
//       })
//       .lean(); // Use lean to return plain JavaScript objects

//     if (photos.length === 0) {
//       return response.status(404).send("No photos found for this user");
//     }

//     // Step 3: Assemble the response data with matched user names
//     const photoData = photos.map(photo => ({
//       _id: photo._id,
//       user_id: photo.user_id,
//       comments: photo.comments.map(comment => {
//         const commenterInfo = userLookup[comment.user_id.toString()] || { first_name: "Unknown", last_name: "User" };
//         return {
//           comment: comment.comment,
//           date_time: comment.date_time,
//           _id: comment._id,
//           user: {
//             _id: comment.user_id,
//             first_name: commenterInfo.first_name, // Get first name from the lookup
//             last_name: commenterInfo.last_name, // Get last name from the lookup
//           }
//         };
//       }),
//       file_name: photo.file_name,
//       date_time: photo.date_time,
//     }));

//     // Return the assembled data
//     return response.json(photoData);
//   } catch (err) {
//     console.error("Error fetching photos:", err);
//     return response.status(500).send("Server error: " + err.message);
//   }
// });

// const server = app.listen(3000, function () {
//   const port = server.address().port;
//   console.log("Listening at http://localhost:" + port + " exporting the directory " + __dirname);
// });


"use strict";

const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");

const express = require("express");
const app = express();

const session = require("express-session");
const bodyParser = require("body-parser");

const User = require("./schema/user.js");
const Photo = require("./schema/photo.js");
const SchemaInfo = require("./schema/schemaInfo.js");

mongoose.set("strictQuery", false);
mongoose.connect("mongodb://127.0.0.1/project6", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.static(__dirname));
app.use(session({ secret: "secretKey", resave: false, saveUninitialized: false }));
app.use(bodyParser.json());

// Middleware to check if user is logged in
app.use((req, res, next) => {
  if (!req.session.user && !['/admin/login', '/admin/logout'].includes(req.path)) {
    return res.status(401).send('Unauthorized');
  }
  next();
});

// Route to handle user login
app.post("/admin/login", async function (req, res) {
  const { login_name } = req.body;

  try {
    const user = await User.findOne({ login_name });
    if (!user) {
      return res.status(400).send("Invalid login name");
    }

    req.session.user = user;
    return res.send({ _id: user._id, first_name: user.first_name });
  } catch (err) {
    return res.status(500).send("Internal server error");
  }
});

// Route to handle user logout
app.post("/admin/logout", function (req, res) {
  if (!req.session.user) {
    return res.status(400).send("No user currently logged in");
  }

  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send("Internal server error");
    }
    return res.sendStatus(200);
  });
});

// Route to get current user info
app.get("/current_user", (req, res) => {
  if (!req.session.user) {
    return res.status(401).send("No user currently logged in");
  }

  res.send(req.session.user);
});

// Route to get SchemaInfo
app.get("/test/:p1", async function (request, response) {
  const param = request.params.p1 || "info";

  if (param === "info") {
    try {
      const info = await SchemaInfo.find({});
      if (info.length === 0) {
        return response.status(500).send("Missing SchemaInfo");
      }
      return response.json(info[0]);
    } catch (err) {
      return response.status(500).json(err);
    }
  } else if (param === "counts") {
    const collections = [
      { name: "user", collection: User },
      { name: "photo", collection: Photo },
      { name: "schemaInfo", collection: SchemaInfo },
    ];

    try {
      await Promise.all(
        collections.map(async (col) => {
          col.count = await col.collection.countDocuments({});
          return col;
        })
      );

      const obj = {};
      for (let i = 0; i < collections.length; i++) {
        obj[collections[i].name] = collections[i].count;
      }
      return response.json(obj);
    } catch (err) {
      return response.status(500).send(JSON.stringify(err));
    }
  } else {
    return response.status(400).send("Bad param " + param);
  }
});

// URL /user/list - Returns all the User objects needed for the navigation sidebar.
app.get("/user/list", async function (request, response) {
  try {
    const users = await User.find({}, "_id first_name last_name");
    return response.json(users);
  } catch (err) {
    return response.status(500).json(err);
  }
});

// URL /user/:id - Returns detailed information of the user.
app.get("/user/:id", async function (request, response) {
  const id = request.params.id;

  try {
    const user = await User.findById(id, "_id first_name last_name location description occupation");
    if (!user) {
      return response.status(400).send("User not found");
    }
    return response.json(user);
  } catch (err) {
    return response.status(400).send("Invalid user ID provided");
  }
});

// URL /photosOfUser/:id - Returns the photos of the user with _id of id.
app.get("/photosOfUser/:id", async function (request, response) {
  const id = request.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return response.status(400).send("Invalid user ID provided");
  }

  try {
    const users = await User.find({}, "_id first_name last_name").lean();
    const userLookup = {};
    users.forEach(user => {
      userLookup[user._id.toString()] = {
        first_name: user.first_name,
        last_name: user.last_name,
      };
    });

    const photos = await Photo.find({ user_id: id })
      .populate({
        path: 'comments.user_id',
        select: '_id'
      })
      .lean();

    if (photos.length === 0) {
      return response.status(404).send("No photos found for this user");
    }

    const photoData = photos.map(photo => ({
      _id: photo._id,
      user_id: photo.user_id,
      comments: photo.comments.map(comment => {
        const commenterInfo = userLookup[comment.user_id.toString()] || { first_name: "Unknown", last_name: "User" };
        return {
          comment: comment.comment,
          date_time: comment.date_time,
          _id: comment._id,
          user: {
            _id: comment.user_id,
            first_name: commenterInfo.first_name,
            last_name: commenterInfo.last_name,
          }
        };
      }),
      file_name: photo.file_name,
      date_time: photo.date_time,
    }));

    return response.json(photoData);
  } catch (err) {
    console.error("Error fetching photos:", err);
    return response.status(500).send("Server error: " + err.message);
  }
});

// Add a comment to a photo
app.post("/commentsOfPhoto/:photo_id", async function (req, res) {
  const { photo_id } = req.params;
  const { comment } = req.body;

  if (!comment) {
    return res.status(400).send("Comment cannot be empty");
  }

  try {
    const photo = await Photo.findById(photo_id);
    if (!photo) {
      return res.status(404).send("Photo not found");
    }

    const newComment = {
      comment: comment,
      user_id: req.session.user._id,
      date_time: new Date()
    };

    photo.comments.push(newComment);
    await photo.save();

    return res.status(200).send("Comment added successfully");
  } catch (err) {
    return res.status(500).send("Internal server error");
  }
});

const server = app.listen(3000, function () {
  const port = server.address().port;
  console.log("Listening at http://localhost:" + port + " exporting the directory " + __dirname);
});
