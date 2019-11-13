import { CompanySchema , ICompany } from './../models/company.model'
import * as mongoose from 'mongoose'
import { Request, Response } from 'express'
import * as fs from 'fs'

const Model: mongoose.Model<ICompany> = mongoose.model<ICompany>('Company' , CompanySchema)

export class CompanyController {
    public add(req: Request, res: Response) {
        try {
            if (req['files'].photo) {
                const file = req['files'].photo
                const path = `./public/companies/${req.body.company_name}/photos/${req['files'].photo.name}-${Date.now()}`
                let photos = [];
                photos.push({ url: path })
                req.body.photos = photos
                file.mv(path, (err) => {
                    if(err) {
                        res.send({ response: false, message: '' })
                    }
                })
            }
            const company = new Model(req.body)
            company.save((err, result) => {
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
        if (req.query.trading_name) {
            params.trading_name = req.query.trading_name
        }
        if (req.query.company_name) {
            params.company_name = req.query.company_name
        }
        if (req.query.email) {
            params.email = req.query.email
        }

        try {
            const { perPage, page } = req.query
            const skip = perPage * page

            Model.find(params, null, { limit: perPage, skip: skip }, (err, result) => {
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
                if (result.photos) {
                    result.photos.forEach(photo => {
                        fs.unlink(photo.url, (err) => {
                            if(err) {
                                res.send({ response: false, message: '' })
                            }
                        })
                    })
                }
                res.status(200).send({ response: true, message: 'Removed successfully' })
            })
        } catch (err) {
            res.status(500).send({ response: false, error: err })
        }
    }
}
