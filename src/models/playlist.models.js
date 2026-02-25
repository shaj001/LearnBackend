import mongoose, {Schema} from "mongoose"

const playlistSchema = new Schema({

    name: {
        type: String,
        require: true
    },
    description:{
        type : String,
        required:true
    },
    owner:{
         type: Schema.Types.ObjectId,
         ref: "User"
    },
      video:{
        type: Schema.Types.ObjectId,
        ref:"Video"
    },
},{timestamps:true})

export const playlist = mongoose.model("playlist", playlistSchema)