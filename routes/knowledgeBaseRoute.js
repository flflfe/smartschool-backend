import express from "express";
const { Router } = express;

import { createKnowledgeBase, publishKnowledgeBase, generateKBAnswer } from '../controllers/qnaMaker.js'

const router = Router();


router.get('/kb/create', async(req, res, next) => {
    try {
        const kdId = await createKnowledgeBase()
        if (!kdId) throw new Error('Error Creating KB')
        console.log(kdId)
        return res.send('Knowlede Base Creation Sucess with id' + kdId)
    } catch (error) {
        return res.send({ message: error.message })

    }


})

router.post('/kb/publish', async(req, res, next) => {
    try {
        const result = await publishKnowledgeBase(req.body.kbId)
        return res.send({ result })

    } catch (error) {
        return res.send({ Error: error.message })

    }

})

router.post('/kb/qn', async(req, res, next) => {
    try {
        const qnObject = req.body.qn
        const kb_id = req.body.kb_id
        console.log(kb_id, qnObject)
        const res = await generateKBAnswer(kb_id, qnObject)
        console.log(res)
        return res.send({ answer: res })
    } catch (E) {
        console.log(E)
        return res.send({ error: E.message })

    }



})
export default router;