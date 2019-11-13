import { isEmpty } from 'lodash';
import { ProfessionalSchema, IProfessional } from './../models/professional.model'
import * as mongoose from 'mongoose'
import { Request, Response } from 'express'
import * as fs from 'fs'

const model: mongoose.Model<IProfessional> = mongoose.model<IProfessional>('Professional' , ProfessionalSchema)

export class ProfessionalController {
    public add(req: Request, res: Response) {
        try {
            if (req['files'].photo) {
                const file = req['files'].photo
                const path = `./public/professionals/${req.body.full_name}/photos/${req['files'].photo.name}-${Date.now()}`
                req.body.photo = path
                file.mv(path, (err) => {
                    if(err) {
                        res.send({ response: false, message: '' })
                    }
                })
            }
            const professional = new model(req.body)
            professional.save((err, result) => {
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
        } catch (err) {
            res.status(500).send({ response: false, error: err })
        }
    }

    public find(req: Request, res: Response) {
        let params
        if (req.query.id) {
            params['_id'] = req.query.id
        }
        if (req.query.full_name) {
            params['full_name'] = req.query.full_name
        }
        if (req.query.email) {
            params['email'] = req.query.email
        }

        try {
            const { perPage, page } = req.query
            const skip = perPage * page

            model.find(params, null, { limit: perPage, skip: skip }, (err, result) => {
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

    public findWorkExperience(req: Request, res: Response) {
        let params = {}
        if(req.query.description){
            params =  {
                $or: [{
                    "professional_experience.title_function": { "$regex": new RegExp(req.query.description, 'i') }
                }, {
                    "professional_experience.description_function": { "$regex": new RegExp(req.query.description, 'i') }
                }]
            }    
        }
        try {
            const { perPage, page } = req.query
            const skip = perPage * page

            model.find(params, null, { limit: perPage, skip: skip },(err, result) => {
                if (err) {
                    res.status(500).send({ response: false, error: err })
                } else {
                    res.status(200).send({ response: true, data: result })
                }
            
            })
        } catch(err) {
            res.status(500).send({ response: false, error: err })
        } finally {
            return;
        }
    }

    public findByRadius (req: Request, res: Response) {
        let params
        if (req.query.latitude && req.query.longitude) {
            params = {
                address: {
                    localtion: {
                        coordinates: {
                            $near: [
                                req.query.latitude,
                                req.query.longitude
                            ],
                            $maxDistance: req.query.distance
                        }
                    }
                }
            }
        } else {
            return;
        }
        try {
            const { perPage, page } = req.query
            const skip = perPage * page

            model.find(params, null, { limit: perPage, skip: skip }, (err, result) => {
                if (err) {
                    res.status(500).send({ response: false, error: err })
                } else
                    res.status(200).send({ response: true, data: result })
            
            })
        } catch(err) {
            res.status(500).send({ response: false, error: err })
        } finally {
            return;
        }
    }

    public update(req: Request, res: Response) {
        try {
            if (req['files'].photo) {
                const file = req['files'].photo
                const path = `./public/professionals/${req.body.full_name}/photos/${req['files'].photo.name}-${Date.now()}`
                req.body.photo = path
                file.mv(path, (err) => {
                    if(err) {
                        res.send({response: false})
                    }
                })
            }
            const id = mongoose.Types.ObjectId(req.query.id)
            mongoose.set('useFindAndModify', true);
            model.findOneAndUpdate({_id: id}, req.body , (err, result) => {
                if (err) {
                    res.status(500).send({ response: false, error: err })
                    return;
                }
                res.status(200).send({ response: true, data: result })
            })
        } catch (err) {
            res.status(500).send({ response: false, error: err })
            return;
        }
    }

    public remove(req: Request, res: Response) {
        try {
            const { id } = req.body
            model.findByIdAndRemove(id, (err, result) => {
                if (err) {
                    res.status(500).send({ response: false, error: err })
                    return;
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
        } finally {
            return;
        }
    }
}
