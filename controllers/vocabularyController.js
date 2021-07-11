import chapterModel from "../models/chapters.js";

export async function getVocabularyList(req, res) {
  try {
    const chapterDoc = await chapterModel.findById(req.chapter);
    if (!chapterDoc.VocabularyList)
      return res.send({ message: "Empty Array", data: dataList });
    const data_list = chapterDoc.VocabularyList;
    console.log(data_list)
    return res.send({ totalData: data_list.length, data: data_list });
  } catch (error) {
    return res.send({ error: error.message });
  }
}

export async function addData(req, res) {
  try {
    if (!req.body.data) throw new Error("Enter valid data in the list");
    const data = req.body.data.toString();
    const chapterDoc = await chapterModel.findById(req.chapter);
    if (!chapterDoc) throw new Error("No list is available in  the chapters");
    const newList = chapterDoc.VocabularyList.push({ data });
    await chapterDoc.save();
    return res.send({ data: chapterDoc.VocabularyList[newList - 1] });
  } catch (error) {
    return res.send({ error: error.message });
  }
}

export async function deleteVocabularyData(req, res) {
  try {
    const id = req.body.data_id;
    const document = await chapterModel.findById(req.chapter);
    const originalLength = document.VocabularyList.length;
    const dataToKeep = document.VocabularyList.filter((data) => {
      return data._id.toString() !== id.toString();
    });
    if (originalLength === dataToKeep.length)
      throw new Error("No such Data to delete");
    document.VocabularyList = dataToKeep;
    await document.save();
    return res
      .status(201)
      .send({ message: "Data deleted successfully", isDeleted: true });
  } catch (error) {
    return res.status(201).send({ message: "Error", error: error.message });
  }
}
export async function updateVocabularyData(req, res) {
  try {
    const data_id = req.body.data_id;
    const NewData = req.body.data;
    const chapterDoc = await chapterModel.findById(req.chapter);
    const info = chapterDoc.VocabularyList.find(
      (data) => data._id.toString() === data_id.toString()
    );
    if (!info) throw new Error("No such Data to Update");
    info.data = NewData;
    await chapterDoc.save();
    return res.status(201).send({
      message: "Data updated successfully",
      isUpdated: true,
      updatedData: info,
    });
  } catch (error) {
    return res.status(201).send({ message: "Error", error: error.message });
  }
}
