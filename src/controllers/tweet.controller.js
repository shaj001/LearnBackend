import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    const {content} = req.body

    if(!content || !content.trim()){
        throw new ApiError(400, "tweet content is required")
    }

    const tweet = await Tweet.create({
        content : content.trim(),
        owner : req.user._id
    })
    if (content.length > 280) {
   throw new ApiError(400, "Tweet exceeds 280 characters");
}

    return res
    .status(201)
    .json(new ApiResponse(201, tweet, "tweet created successfully"))
})

const getUserTweets = asyncHandler(async (req, res) => {
    const {userId} = req.params;

    if(!isValidObjectId(userId)){
        throw new ApiError(400, "invalid user id")
    }

    const tweet = await Tweet.find({owner : userId})
    .sort({ createdAt : -1})
    .populate("owner","username avatar");

    return res
    .status(200)
    .json(new ApiResponse(200, tweet, "user tweets fetched successfully"))
})

const updateTweet = asyncHandler(async (req, res) => {
    const {tweetId} = req.params;
    const {content} = req.body;

    if(!isValidObjectId(tweetId)){
        throw new ApiError(400, "invalid tweet id")
    }

    if(!content || !content.trim()){
        throw new ApiError(400, "content cannot be empty")
    }

    const tweet = await Tweet.findById(tweetId);

    if(!tweet){
        throw new ApiError(404, "tweet not found")
    }

     if (tweet.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Unauthorized");
    }

    tweet.content = content.trim();
    await tweet.save();

    return res
    .status(200)
    .json(new ApiResponse(200,tweet, "tweet updates successfully"))

})

const deleteTweet = asyncHandler(async (req, res) => {
    const {tweetId} = req.params;
    if(!isValidObjectId(tweetId)){
        throw new ApiError(400, "invalid tweet id")
    }

    const tweet = await Tweet.findById(tweetId);

     if(!tweet){
        throw new ApiError(404, "tweet not found")
    }
     if (tweet.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Unauthorized");
    }

    await tweet.deleteOne();

    return res
    .status(200)
    .json(new ApiResponse(200,{}, "tweet deleted successfully"))
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}