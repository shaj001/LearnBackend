import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
   const channelId = req.user?._id

    if (!channelId) {
        throw new ApiError(401, "Unauthorized")
    }

    // Total videos + total views
    const videoStats = await Video.aggregate([
        {
            $match: { owner: channelId }
        },
        {
            $group: {
                _id: null,
                totalVideos: { $sum: 1 },
                totalViews: { $sum: "$views" }
            }
        }
    ])

    const totalSubscribers = await Subscription.countDocuments({
        channel: channelId
    })

    // Get video IDs first
    const videos = await Video.find({ owner: channelId }).select("_id")

    const videoIds = videos.map(v => v._id)

    const totalLikes = await Like.countDocuments({
        video: { $in: videoIds }
    })

    return res
    .status(200)
    .json(
        new ApiResponse(200, {
            totalVideos: videoStats[0]?.totalVideos || 0,
            totalViews: videoStats[0]?.totalViews || 0,
            totalSubscribers,
            totalLikes
        }, "Channel stats fetched successfully")
    )
})

const getChannelVideos = asyncHandler(async (req, res) => {
     const channelId = req.user?._id
    let { page = 1, limit = 10 } = req.query

    if (!channelId) {
        throw new ApiError(401, "Unauthorized")
    }

    page = parseInt(page)
    limit = parseInt(limit)
    const skip = (page - 1) * limit

    const videos = await Video.find({ owner: channelId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)

    const totalVideos = await Video.countDocuments({ owner: channelId })

    return res.status(200).json(
        new ApiResponse(200, {
            videos,
            totalVideos,
            currentPage: page,
            totalPages: Math.ceil(totalVideos / limit)
        }, "Channel videos fetched successfully")
    )
})

export {
    getChannelStats, 
    getChannelVideos
    }