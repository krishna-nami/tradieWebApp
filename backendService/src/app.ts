import express, { urlencoded } from "express";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({ message: "This is our first landing page" });
});

export default app;
