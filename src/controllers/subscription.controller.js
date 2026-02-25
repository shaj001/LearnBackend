import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params;

    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel ID")
    }

    const subscriberId = req.user?._id

    if (!subscriberId) {
        throw new ApiError(401, "Unauthorized")
    }

    if (subscriberId.toString() === channelId) {
        throw new ApiError(400, "You cannot subscribe to yourself")
    }

    const existingSubscription = await Subscription.findOne({
        subscriber: subscriberId,
        channel: channelId
    })

    if (existingSubscription) {
        await Subscription.deleteOne({ _id: existingSubscription._id })

        return res
        .status(200)
        .json(
            new ApiResponse(200, null, "Unsubscribed successfully")
        )
    }

    await Subscription.create({
        subscriber: subscriberId,
        channel: channelId
    })

    return res
    .status(200)
    .json(
        new ApiResponse(200, null, "Subscribed successfully")
    )
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
     const { channelId } = req.params

    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel ID")
    }

    const subscribers = await Subscription.find({ channel: channelId })
        .populate("subscriber", "username fullName avatar")

    const count = await Subscription.countDocuments({ channel: channelId })

    return res
    .status(200)
    .json(
        new ApiResponse(200, {subscribers, count}, "Subscribers fetched successfully")
    )
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params

    if (!isValidObjectId(subscriberId)) {
        throw new ApiError(400, "Invalid subscriber ID")
    }

    const channels = await Subscription.find({ subscriber: subscriberId })
        .populate("channel", "username fullName avatar")

    return res
    .status(200)
    .json(
        new ApiResponse(200, channels, "Subscribed channels fetched successfully")
    )
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}