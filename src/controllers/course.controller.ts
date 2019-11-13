import { CourseSchema , ICourse } from './../models/course.model'
import * as mongoose from 'mongoose'
import { Request, Response } from 'express'
import * as fs from 'fs'

const Model: mongoose.Model<ICourse> = mongoose.model<ICourse>('Course' , CourseSchema)

export class CourseController {
    public add(req: Request, res: Response) {
        try {
            if (req['files'].photo) {
                const file = req['files'].photo
                const path = `./public/courses/${req.body.title}/photos/${req['files'].photo.name}-${Date.now()}`
                req.body.photo = path
                file.mv(path, (err) => {
                    if(err) {
                        res.send({ response: false, message: '' })
                    }
                })
            }
            const course = new Model(req.body)
            course.save((err, result) => {
                if (err) {
                    res.status(500).send({ response: false, error: err })
                } 
                res.status(200).send({ response: true, data: result }) 
            })
        } catch (err) {
            res.status(500).send({ response: false, error: err })
        }
    }

    public find(req: Request, res: Response) {
        let params

        if (req.query.id) {
            params.id = req.query.id
        }
        if (req.query.companyId) {
            params.companyId = req.query.companyId
        }
        if (req.query.title) {
            params.title = req.query.title
        }
        if (req.query.type) {
            params.type = req.query.type
        }

        try {
            const { perPage, page } = req.query
            const skip = perPage * page

            Model.findById(params, null, { limit: perPage, skip: skip }, (err, result) => {
                if (err) {
                    res.status(500).send({ response: false, error: err })
                }
                res.status(200).send({ response: true, data: result })
            })
        } catch (err) {
            res.status(500).send({ response: false, error: err })
        }
    }

    public update(req: Request, res: Response) {
        try {
            const { id } = req.body
            Model.findByIdAndUpdate(id, (err, result) => {
                if (err) {
                    res.status(500).send({ response: false, error: err })
                }
                res.status(200).send({ response: true, data: result })
            })
        } catch (err) {
            res.status(500).send({ response: false, error: err })
        }
    }

    public remove(req: Request, res: Response) {
        try {
            const { id } = req.body
            Model.findByIdAndRemove(id, (err, result) => {
                if (err) {
                    res.status(500).send({ response: false, error: err })
                }
                if (result.photo) {
                    fs.unlink(result.photo, (err) => {
                        if(err) {
                            res.send({ response: false, message: '' })
                        }
                    })
                }
                res.status(200).send({ response: true, message: 'Removed successfully' })
            })
        } catch (err) {
            res.status(500).send({ response: false, error: err })
        }
    }
}
