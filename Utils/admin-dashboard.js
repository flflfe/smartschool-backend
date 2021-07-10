import AdminBro from "admin-bro";
import adminBroExpress from "@admin-bro/express";
const { buildRouter } = adminBroExpress;
import AdminBroMongoose from "@admin-bro/mongoose";

import User from "../models/users.js";
import classrooms from "../models/classrooms.js";
import chapters from "../models/chapters.js";
import recordings from "../models/recordings.js";
import subjects from "../models/subjects.js";
import resources from "../models/resources.js";

AdminBro.registerAdapter(AdminBroMongoose);
const adminBro = new AdminBro({
  rootPath: "/admin",
  resources: [User, classrooms, chapters, recordings, subjects, resources],
});

const adminRouter = buildRouter(adminBro);
export default adminRouter;
