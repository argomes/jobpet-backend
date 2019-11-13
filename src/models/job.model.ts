import * as mongoose from 'mongoose'

const Schema = mongoose.Schema
const ObjectId = mongoose.Schema.Types.ObjectId;

const Genders = Object.freeze({
    Male: 'male',
    Female: 'female',
    Other: 'any',
})

export interface IJob extends mongoose.Document {
    companyId: String,
    professional: [{
        _id: String,
    }],
    title: String,
	description: String,
	experience: String,
	reference: String,
	salary: Number
    gender: String,
	type: String,
}

export const JobSchema = new Schema({
    companyId: {
        type: ObjectId,
        required: true,
    },
    professional: [{
        _id: {
            type: ObjectId,
            required: true,
        }
    }],
    title: {
        type: String,
        required: true,
    },
	description: {
        type: String,
        required: true,
    },
	experience: {
        type: String,
        required: true,
    },
	reference: {
        type: String,
        required: true,
    },
	salary: {
        type: Number,
        required: true,
    },
    gender: {
        type: String,
        enum: Object.values(Genders),
    },
	type: {
        type: String,
        required: true,
    },
    location:{
        type: String,
        required: true
    }
})
