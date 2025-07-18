import express from "express"
import "dotenv/config";
import cors from "cors";
import { connectDB } from "./utils/db.js";
import userRoutes from "./routes/userRoutes.js"
import bookRoutes from "./routes/bookRoutes.js"

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.use("/api/auth",userRoutes);
app.use("/api/books",bookRoutes);


app.listen(PORT,()=>{
    connectDB();
    console.log(`server is running on ${PORT}`);
})
