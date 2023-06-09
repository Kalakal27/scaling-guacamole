const express = require("express");
const commentRouter = express.Router();
const Post = require("../models/post");
const mongoose = require("mongoose");


Post.find()
  .populate({
    path: 'comments',
    populate: {
      path: 'author',
      model: 'User'
    }
  })

commentRouter.post("/:postId", (req, res, next) => {
  const newComment = req.body;
  Post.findByIdAndUpdate(
    { _id: req.params.postId, user: req.auth._id },
    { $addToSet: { comments:{ comment: newComment.comment, author: mongoose.Types.ObjectId(req.auth._id)}} },
    { new: true },
    (err, updatedPost) => {
      if (err) {
        res.status(500);
        return next(err);
      } 
      console.log(updatedPost)
    }
  );
  Post.find({_id: req.params.postId}).populate({
    path: "comments",
      populate: {
        path: "author",
        select: "username"
      }
  }).exec((err, populatedPost) => {
    if (err){
      res.status(500)
      return next(err)
    }
    return res.status(201).send({populatedPost})
  })
});



commentRouter.delete("/:postId/:commentId", (req, res, next) => {
  Post.findOneByIdAndUpdate(
    {
      _id: req.params.postId,
      user: req.auth._id,
      comment: req.params.commentId,
    },
    { $pull: { comments: req.params.commentId } },
    (err, deletedComment) => {
      if (err) {
        res.status(500);
        return next(err);
      }
      return res
        .status(200)
        .send(`Successfully deleted comment: ${deletedComment.Comment}`);
    }
  );
});


commentRouter.put("/:commentId", (req, res, next) => {
  Comment.findOneAndUpdate(
    { _id: req.params.commentId, user: req.auth._id },
    req.body,
    { new: true },
    (err, updatedComment) => {
      if (err) {
        res.status(500);
        return next(err);
      }
      return res.status(201).send(updatedComment);
    }
  );
});

module.exports = commentRouter;