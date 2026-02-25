import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
     const { videoId } = req.params

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID")
    }

    const userId = req.user?._id

    if (!userId) {
        throw new ApiError(401, "Unauthorized")
    }

    const existingLike = await Like.findOne({
        likedBy: userId,
        video: videoId
    })

    if (existingLike) {
        await Like.deleteOne({ _id: existingLike._id })

        return res
        .status(200)
        .json(
            new ApiResponse(200, null, "Video unliked")
        )
    }

    await Like.create({
        likedBy: userId,
        video: videoId
    })

    return res
    .status(200)
    .json(
        new ApiResponse(200, null, "Video liked")
    )
})

const toggleCommentLike = asyncHandler(async (req, res) => {
      const { commentId } = req.params

    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment ID")
    }

    const userId = req.user?._id

    if (!userId) {
        throw new ApiError(401, "Unauthorized")
    }

    const existingLike = await Like.findOne({
        likedBy: userId,
        comment: commentId
    })

    if (existingLike) {
        await Like.deleteOne({ _id: existingLike._id })

        return res
        .status(200)
        .json(
            new ApiResponse(200, null, "Comment unliked")
        )
    }

    await Like.create({
        likedBy: userId,
        comment: commentId
    })

    return res
    .status(200)
    .json(
        new ApiResponse(200, null, "Comment liked")
    )

})

const toggleTweetLike = asyncHandler(async (req, res) => {
     const { tweetId } = req.params

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet ID")
    }

    const userId = req.user?._id

    if (!userId) {
        throw new ApiError(401, "Unauthorized")
    }

    const existingLike = await Like.findOne({
        likedBy: userId,
        tweet: tweetId
    })

    if (existingLike) {
        await Like.deleteOne({ _id: existingLike._id })

        return res.status(200).json(
            new ApiResponse(200, null, "Tweet unliked")
        )
    }

    await Like.create({
        likedBy: userId,
        tweet: tweetId
    })

    return res.status(200).json(
        new ApiResponse(200, null, "Tweet liked")
    )
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
     const userId = req.user?._id

    if (!userId) {
        throw new ApiError(401, "Unauthorized")
    }

    const likedVideos = await Like.find({
        likedBy: userId,
        video: { $ne: null }
    })
    .populate("video")

    return res
    .status(200)
    .json(
        new ApiResponse(200, likedVideos, "Liked videos fetched successfully")
    )
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}