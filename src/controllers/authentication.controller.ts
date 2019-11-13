import { NextFunction, Request, Response } from 'express'
import * as passport from 'passport'
import * as jwt from 'jsonwebtoken'
import * as Mongoose from 'mongoose'
import { ProfessionalSchema, IProfessional } from './../models/professional.model'
import { CompanySchema, ICompany } from './../models/company.model'
import { decode } from 'punycode'

const company: Mongoose.Model<ICompany> = Mongoose.model<ICompany>('Company' , CompanySchema)
const professional: Mongoose.Model<IProfessional> = Mongoose.model<IProfessional>('Professional' , ProfessionalSchema)

export class AuthController {

    public authenticateJWT(req: Request, res: Response, next: NextFunction) {
        passport.authenticate('jwt', function(err, user, info) {
            if (err) {
                return res.status(401).json({ status: 'error', code: 'unauthorized' })
            }
            if (!user) {
                return res.status(401).json({ status: 'error', code: 'unauthorized' })
            } else {
                return next()
            }
        })(req, res, next)
    }

    public authorizeJWT(req: Request, res: Response, next: NextFunction) {
        passport.authenticate('jwt', function (err, user, jwtToken) {
            if (err) {
                return res.status(401).json({ status: 'error', code: 'unauthorized' })
            }
            if (!user) {
                return res.status(401).json({ status: 'error', code: 'unauthorized' })
            } else {
                const scope = req.baseUrl.split('/').slice(-1)[0]
                const authScope = jwtToken.scope
                if (authScope && authScope.indexOf(scope) > -1) {
                    return next()
                } else {
                    return res.status(401).json({ status: 'error', code: 'unauthorized' })
                }
            }
        })(req, res, next)
    }

    public authenticateUser(req: Request, res: Response, next: NextFunction) {
        if(req.body.account === 'PROFESSIONAL'){
            professional.findOne({email: req.body.username} , (err, user: any) => {
                if (err) {
                    res.status(500).json({ error: err })
                }
                if (!user) {
                    res.status(401).json({ message: `username ${req.body.username} not found.` })
                } else {
                    user.comparePassword(req.body.password,  (err: Error, isMatch: boolean) => {
                        if (err) {
                            res.status(500).json({ error: err })
                        }
                        if (isMatch) {
                            const token = jwt.sign({ user, account : req.body.account }, process.env.SECRET, {
                                expiresIn: process.env.TOKENLIFE
                            })
                            res.status(200).send({ auth: true, token: token })
                        } else {
                            res.status(401).json( { message: 'Invalid username or password.' })
                        }
                    })
                }  
            })
        } else {
            company.findOne({email: req.body.username} , (err, user: any) => {
                if (err) {
                    res.status(500).json({ error: err })
                }
                if (!user) {
                    res.status(401).json({ message: `username ${req.body.username} not found.` })
                } else {
                    user.comparePassword((req.body.password,  (err: Error, isMatch: boolean) => {
                        if (err) {
                            res.status(500).json({ error: err })
                        }
                        if (isMatch) {
                          user['account'] = 'COMPANY'
                            const token = jwt.sign({ user, account: req.body.account }, process.env.SECRET, {
                                expiresIn: process.env.TOKENLIFE
                            })
                            res.status(200).send({ auth: true, token: token })
                        } else {
                            res.status(401).json( { message: 'Invalid username or password.' })
                        }
                    }))
                }  
            })
        }    
    }

    public validationToken(req: Request, res: Response, next: NextFunction) {
        const token = req.headers['x-access-token']
        if (!token) {
            return res.status(401).send({ auth: false, message: 'No token provided.' })
        }
        jwt.verify(token.toString(), process.env.SECRET, function(err, decoded){
            if(err) {
                console.log(err)
                return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' })
            }
            req['userId'] = decoded['user']['_id']
            req['account'] = decoded['account']
            next()
        })
    }
}