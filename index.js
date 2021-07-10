import cors from "cors";
import express, { json } from "express";
import "./db/db.js";
const app = express();
const port = process.env.port || 3000;

import mainRoutes from "./routes/mainroutes.js";
import adminRoutes from "./routes/adminroutes.js";

app.use(express.static("/uploads"));
app.use(json());
app.use(cors());
app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});
app.use(mainRoutes);
app.use(adminRoutes);
app.get("/", (req, res) => res.send("Hello World!"));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
