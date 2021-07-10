import Users from "../models/users.js";
import classrooms from "../models/classrooms.js";
export async function postUserSignUp(req, res) {
  const user = new Users(req.body);
  try {
    const classroom = await classrooms.findById(req.body.classroom);
    if (!classroom) {
      return res.status(404).send({ Error: "Invalid classroom id" });
    }
    await user.save();
    return res.send({
      message: "Success!",
    });
  } catch (E) {
    console.log(E);
    if (E.name === "MongoError" && E.code === 11000)
      return res.status(409).send({
        Error: "Duplicate error",
        E,
      });
    return res.status(400).send({
      Error: E.message,
    });
  }
}

export async function postLogoutAllSession(req, res, next) {
  try {
    req.user.tokens = [];
    await req.user.save();
  } catch (error) {
    return res.status(500).send(error);
  }
}

export async function postUserSignIn(req, res) {
  try {
    const user = await Users.findByProvideInfo(
      req.body.Email,
      req.body.Password
    );
    const token = await user.getToken();
    const userData = await user
      .populate({
        path: "classroom",
        select: ["Name"],
      })
      .execPopulate();
    res.json({
      user: userData,
      token,
    });
  } catch (error) {
    return res.status(401).send({
      Error: "Error Logging",
      error,
    });
  }
}

export async function deleteUser(req, res, next) {
  try {
    const usertoDelete = await Users.findByIdAndDelete(req.params.id);
    if (!usertoDelete) {
      return res.status(404).send({ Error: "No user Found" });
    }
    res.send(usertoDelete);
  } catch (error) {
    return res.status(500).send({
      Error: E,
    });
  }
}

export async function updateUser(req, res, next) {
  const isallowed = ["Name", "password"];
  const entity = Object.keys(req.body);
  const isValid = entity.every((data) => isallowed.includes(data));
  if (!isValid) return res.status(401).send({ Error: "Invalid Operation" });
  try {
    entity.forEach((entry) => {
      req.user[entry] = req.body[entry];
    });
    await req.user.save();
    return res.status(201).send(req.user);
  } catch (e) {
    return res.status(404).send({
      Error: e,
    });
  }
}
export async function postLogoutUsers(req, res, next) {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token != req.token;
    });
    await req.user.save();
    return res.redirect(200, "/login");
  } catch (error) {
    return res.status(200).send({ Error: error.message });
  }
}
