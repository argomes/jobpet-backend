import { ILead,leadSchema } from './../models/leads.model';
import * as mongoose from 'mongoose'
import { Request, Response } from 'express'

const Model: mongoose.Model<ILead> = mongoose.model<ILead>('Lead' , leadSchema)

export class LeadController {
    public add(req: Request, res: Response) {
        const lead = new Model(req.body)
        lead.save((err, result) =>{
            if (err) {
                if (err.name === 'ValidationError') {
                    res.status(400).send({ response: false, error: err })
                } else {
                    res.status(500).send({ response: false, error: err })
                }
            } else {
                res.status(200).send({ response: true, data: result }) 
            }
        })
    }
    public find(req: Request, res: Response) {
        let params
        if (req.query.id) {
            params['phone'] = req.query.phone
        }
        if (req.query.full_name) {
            params['name'] = req.query.name
        }
        if (req.query.email) {
            params['email'] = req.query.email
        }

        try {
            const { perPage, page } = req.query
            const skip = perPage * page

            Model.find(params, null, { limit: perPage, skip: skip }, (err, result) => {
                if (err) {
                    res.status(500).send({ response: false, error: err })
                } else {
                    res.status(200).send({ response: true, data: result })
                }
            })
        } catch (err) {
            res.status(500).send({ response: false, error: err })
        }
    }
    public update(req: Request, res: Response) {
    }
    public remove(req: Request, res: Response) {
    }
}