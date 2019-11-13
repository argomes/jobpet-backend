import * as mongoose from 'mongoose'
import validator from 'validator'
import * as bcrypt from 'bcrypt-nodejs'

const Schema = mongoose.Schema

const Type_Document = Object.freeze({
    RG: 'rg',
    CPF: 'cpf',
    CNH: 'cnh',
    CTPS: 'ctps',
    PASSAPORTE: 'passaporte',
    CNPJ: 'cnpj',
    IE: 'ie'
})

export interface ICompany extends mongoose.Document {
    trading_name: {
        type: String,
        required: true
    },
    company_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: [true, 'Password is required!'],
        trim: true,
        minlength: [6, 'Password need to be longer!']
    },
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
    photos: [{
        url: {
            type: String,
            required: true
        }
    }],
    services: [{
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        }
    }],
    document:[{
        type: {
            type: String
        },
        number: String
    }]
}

export const CompanySchema = new Schema({
    trading_name: {
        type: String,
        required: true
    },
    company_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
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
    photos: [{
        name: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    }],
    services: [{
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        }
    }],
    document:[{
        type_document: {
            type: String, 
            enum: Object.values(Type_Document)
        },
        number: String
    }]
})

CompanySchema.pre<ICompany>('save', function save(next) {
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

CompanySchema.methods.comparePassword = function (candidatePassword: string, callback: any) {
    bcrypt.compare(candidatePassword, this.password, (err: Error, isMatch: boolean) => {
        callback(err, isMatch)
    })
}
  
