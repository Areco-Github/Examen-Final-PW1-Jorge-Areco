import "dotenv/config";
import express from "express";
import routes from "./routes";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(express.json());

app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use("/", routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});
