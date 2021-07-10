import chapters from "../models/chapters.js";
import resources from "../models/resources.js";

export async function createresource(req, res) {
  console.log(req.params.chapter);

  const chapter = await chapters.findOne({ _id: req.params.chapter });
  if (!chapter) {
    return res.status(404).send({ Error: "No such chapter" });
  }
  const resource = new resources({
    name: req.body.name,
    fileUrl: req.body.fileUrl,
    chapter: chapter._id,
    author: req.user._id,
  });
  try {
    await resource.save();
    chapter.resourceFiles.push(resource);
    await chapter.save();
    res.send({ resource });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ Error: error });
  }
}
