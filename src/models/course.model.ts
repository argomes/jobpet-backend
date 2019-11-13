import * as mongoose from 'mongoose'

const Schema = mongoose.Schema
const ObjectId = mongoose.Schema.Types.ObjectId;

export interface ICourse extends mongoose.Document {
    companyId: String,
    title: String,
	description: String,
	type: String,
	photo: String,
}

export const CourseSchema = new Schema({
    companyId: {
        type: ObjectId,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
	description: {
        type: String,
        required: true,
    },
	type: {
        type: String,
        required: true,
    },
    photo: {
        type: String
    }
})
