import cors from "cors";
import express, { json } from "express";
import "./db/db.js";
import path from "path";

const __dirname = path.resolve();
const app = express();
const port = process.env.port || 3000;

import mainRoutes from "./routes/mainroutes.js";
import adminRoutes from "./routes/adminroutes.js";
import storageRoutes from "./routes/storageroute.js";
import knowledgeBaseRoute from "./routes/knowledgeBaseRoute.js";
import VocabilaryRoute from "./routes/VocabularyRoute.js";

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(express.static("/uploads"));
app.use(express.static(path.join(__dirname, "public")));
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
app.use(storageRoutes);
app.use(knowledgeBaseRoute);
app.use(VocabilaryRoute);

app.get("/home", (req, res, next) => {
  res.render("index");
});
app.get("/", (req, res) => res.send(`Hello World! ${req.hostname}`));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
