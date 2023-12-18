import { Router } from "express";
import { ObjectId } from "mongodb";

const router = Router();

router
    .route("/")
    .get(async(req, res) => {
        //get posts
    })
    .post(async(req, res) => {
        //post post
    })
    .patch(async(req, res) => {
        //edit post
    })

router
    .route("/:id")
    .get(async(req,res) => {
        //get post by id
    })

router
    .route("/:id/comment")
    .post(async(req, res) => {
        //post comment on post by id
    })

router
    .route("/:id/comment/:commentId")
    .post(async(req, res) => {
        //like or dislike a comment
    })
    .delete(async(req,res) => {
        //delete a comment
    })
export default router;