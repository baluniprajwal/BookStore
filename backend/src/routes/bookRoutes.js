import express from "express"
import protectRoute from "../middlewares/authMiddleware.js";
import { createBook, deleteBook, getBooks, getRecommendedBooks } from "../controllers/bookController.js";


const router = express.Router();

router.post("/",protectRoute,createBook);
router.get("/",protectRoute,getBooks);
router.get("/user",protectRoute,getRecommendedBooks);
router.delete("/:id",protectRoute,deleteBook);



export default router;