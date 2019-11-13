import * as mongoose from 'mongoose'
import validator from 'validator'
import * as bcrypt from 'bcrypt-nodejs'


const Schema = mongoose.Schema

const Genders = Object.freeze({
    Male: 'male',
    Female: 'female',
    Other: 'other',
})

const Type_Document = Object.freeze({
    RG: 'rg',
    CPF: 'cpf',
    CNH: 'cnh',
    CTPS: 'ctps',
    PASSAPORTE: 'passaporte'
})

const materialStatus = Object.freeze({
    SINGLE:'single',
    MARRIED: 'married',
    WIDOWER:'widower',
    DIVORCIED:'divorcied'
});


export interface IProfessional extends mongoose.Document {
    full_name: String,
    birth_date: Date,
    gender: String,
    email: String,
    marital_status: String,
    password: String,
    photo_profile: String,
    address: [{
        postal_code: String,
        street: String,
        number: String,
        neighborhood: String
        city: String,
        state: String,
        country: String,
        localtion: {
            type: {
                type: String
            },
            coordinates: [Number]
        },
        complement: String
    }],
    document:[{
        type: {
            type: String
        },
        number: String
    }],
    contact: [{
        type: {
            type: String,
            required: true
        },
        value: {
            type: String,
            required: true
        }
    }],
    professional_experience:[{
        date_start:{
            type: Date,
            required: true
        },
        isCurrent:{
            type: Boolean
        },
        date_end:{
            type: Date
        },
        company:{
            name:{
                type:String
            },
            ObjectId:{
                type: Object
            },
            references:{
                name:{
                    type:String
                },
                contact:{
                    type_contact:{
                        type: String
                    },
                    value:{
                        type: String
                    }
                }
            }
        },
        title_function:{
            type: String
        },
        description_function:{
            type: String
        }
    }]
}

export const ProfessionalSchema = new Schema({
    full_name: {
        type: String,
        required: [true, 'Name is required!']
    },
    birth_date:{
        type: Date,
        retquired: [true, 'birthDate is required!']
    },
    gender: {
        type: String,
        enum: Object.values(Genders),
    },
    marital_status:{
        type: String,
        enum: Object.values(materialStatus)
    },
    email: {
        type: String,
        required: [true, 'E-mail is required!'],
        unique: true,
        validate: {
            validator(email) {
                return validator.isEmail(email)
            },
            message:'{VALUE} is not a valid email!'
        }
    },
    password: {
        type: String,
        required: [true, 'Password is required!'],
        trim: true,
        minlength: [6, 'Password need to be longer!']
    },
    photo_profile: {
        type: String
    },
    address: [{
        postal_code: {
            type: String,
            required: true
        },
        street: {
            type: String,
            required: true
        },
        number: {
            type: String,
            required: true
        },
        neighborhood: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        },
        localtion: {
            type: {
                type: String
            },
            coordinates: [Number]
        },
        complement: String
    }],
    document:[{
        type_document: {
            type: String, 
            enum: Object.values(Type_Document)
        },
        number: String
    }],
    contact: [{
        type: {
            type: String,
            required: true
        },
        value: {
            type: String,
            required: true
        }
    }],
    professional_experience:[{
        date_start:{
            type: Date,
            required: true
        },
        isCurrent:{
            type: Boolean
        },
        date_end:{
            type: Date
        },
        company:{
            name:{
                type:String
            },
            ObjectId:{
                type: Object
            },
            references:{
                name:{
                    type:String
                },
                contact:{
                    type: {
                        type: String,
                        required: true
                    },
                    value: {
                        type: String,
                        required: true
                    }
                }
            }
        },
        title_function:{
            type: String
        },
        description_function:{
            type: String
        }
    }],
    extracurricular_course:[{
        
    }]
})


ProfessionalSchema.pre<IProfessional>('save', function save(next) {
    const user = this
  
    bcrypt.genSalt(10, (err, salt) => {
        if (err) {
            return next(err)
        }
        bcrypt.hash(this.password, salt, undefined, (err: Error, hash) => {
            if (err) {
                return next(err)
            }
            user.password = hash
            next()
        })
    })
  })

ProfessionalSchema.methods.comparePassword = function (candidatePassword: string, callback: any) {
    bcrypt.compare(candidatePassword, this.password, (err: Error, isMatch: boolean) => {
        callback(err, isMatch)
    })
}
  