import { JobSchema , IJob } from './../models/job.model'
import * as mongoose from 'mongoose'
import { Request, Response } from 'express'
import { isEmpty } from 'lodash';

const Model: mongoose.Model<IJob> = mongoose.model<IJob>('Job' , JobSchema)

export class JobController {
    public add(req: Request, res: Response) {
        try {
            if (isEmpty(req['account']) || req['account'] === 'PROFESSIONAL') {
                res.status(403).send({ response: false, error: 'YOU DON\'T HAVE PERMISSION ACCESS ' })
                return;
            }
            let body = req.body
            body.companyId = mongoose.Types.ObjectId(req['userId'])
            const job = new Model(body)
            
            job.save((err, result) => {
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
        if (req.query.salary) {
            params.salary = req.query.salary
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
            if (isEmpty(req['account']) || req['account'] === 'PROFESSIONAL') {
                res.status(403).send({ response: false, error: 'YOU DON\'T HAVE PERMISSION ACCESS ' })
                return;
            }
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
            if (isEmpty(req['account']) || req['account'] === 'PROFESSIONAL') {
                res.status(403).send({ response: false, error: 'YOU DON\'T HAVE PERMISSION ACCESS ' })
                return;
            }
            Model.findByIdAndRemove(id, (err) => {
                if (err) {
                    res.status(500).send({ response: false, error: err })
                }
                res.status(200).send({ response: true, message: 'Removed successfully' })
            })
        } catch (err) {
            res.status(500).send({ response: false, error: err })
        }
    }
}
