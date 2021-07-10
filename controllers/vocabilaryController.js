import chapterModel from "../models/chapters.js";
import subjectModel from "../models/subjects.js";


export async function getVocabilaryList(req, res) {

    try {
        const chapterDoc = await chapterModel.findById(req.chapter)
        if (!chapterDoc.VocabilaryList) return res.send({ message: "Empty Array", data: dataList })
        const data_list = chapterDoc.VocabilaryList
        return res.send({ totalData: data_list.length, data: data_list })

    } catch (error) {
        return res.send({ error: error.message })
    }


}

export async function addData(req, res) {

    try {
        if (!req.body.data) throw new Error("Enter valid data in the list")
        const data = req.body.data.toString()
        const chapterDoc = await chapterModel.findById(req.chapter)
        if (!chapterDoc) throw new Error("No list is available in  the chapters")
        const newList = chapterDoc.VocabilaryList.push({ data })
        await chapterDoc.save()
        return res.send({ data: chapterDoc.VocabilaryList[newList - 1] })

    } catch (error) {
        return res.send({ error: error.message })
    }

}

export async function deleteVocabilaryData(req, res) {
    try {
        const id = req.body.data_id
        const document = await chapterModel.findById(req.chapter)
        const originalLength = document.VocabilaryList.length
        const dataToKeep = document.VocabilaryList.filter((data) => {
            return data._id.toString() !== id.toString()
        })
        if (originalLength === dataToKeep.length) throw new Error("No such Data to delete")
        document.VocabilaryList = dataToKeep
        await document.save()
        return res.status(201).send({ message: "Data deleted successfully", isDeleted: true })
    } catch (error) {
        return res.status(201).send({ message: "Error", error: error.message })


    }

}
export async function updateVocabilaryData(req, res) {
    try {
        const data_id = req.body.data_id
        const NewData = req.body.data
        const chapterDoc = await chapterModel.findById(req.chapter)
        const info = chapterDoc.VocabilaryList.find(data => data._id.toString() === data_id.toString())
        if (!info) throw new Error("No such Data to Update")
        info.data = NewData
        await chapterDoc.save()
        return res.status(201).send({ message: "Data updated successfully", isUpdated: true, updatedData: info })
    } catch (error) {
        return res.status(201).send({ message: "Error", error: error.message })


    }

}