import dotenv from "dotenv"
import connectDB from "./db/db_index.js";
import app from "./app.js";

const PORT = process.env.PORT || 8000;

dotenv.config({
    path:"./.env"
})


connectDB()
.then(() => {
    app.listen(PORT, () => {
        console.log(`⚙️  Server is running at port : ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
})
app.get("/", (req, res) => {
  res.send("server is Working ");
});