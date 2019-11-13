import { LeadRouter } from './routes/lead.router';
import { AuthenticationRouter } from './routes/authentication.router'
import * as express from 'express'
import * as bodyParser from 'body-parser'
import { CompanyRouter } from './routes/company.router'
import { CourseRouter } from './routes/course.router'
import { JobRouter } from './routes/job.router'
import { ProfessionalRouter } from './routes/professional.router'
import * as mongoose from 'mongoose'
import * as cors from 'cors'
import * as fileUpload from 'express-fileupload'
import * as swaggerUi from 'swagger-ui-express'

require('dotenv').config()
const swaggerDocument = require('../swagger.json')
        
class App {
    public mongoUrl: string = process.env.MONGO_URL
    public app: express.Application

    public authenticationRouter: AuthenticationRouter = new AuthenticationRouter()
    public companyRouter: CompanyRouter = new CompanyRouter()
    public courseRouter: CourseRouter = new CourseRouter()
    public jobRouter: JobRouter = new JobRouter()
    public professionalRouter: ProfessionalRouter = new ProfessionalRouter()
    public leadRouter: LeadRouter = new LeadRouter()

    public options:cors.CorsOptions = {
        allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'X-Access-Token'],
        credentials: true,
        methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
        origin: 'http://localhost:3000/',
        preflightContinue: false
    }

    constructor() {
        this.app = express()
        this.mongoSetup()
        this.config()
        this.authenticationRouter.routes(this.app)
        this.companyRouter.routes(this.app)
        this.courseRouter.routes(this.app)
        this.jobRouter.routes(this.app)
        this.leadRouter.routes(this.app)
        this.professionalRouter.routes(this.app)
        this.app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
    }

    private mongoSetup(): void {
        mongoose.Promise = global.Promise
        mongoose.connect(this.mongoUrl, {useNewUrlParser: true})
            .then(() => {
                console.log('MongoDB connected')
            })
            .catch((err) => {
                throw err
            })
    }

    private config(): void {
        this.app.use(express.static('public'));
        this.app.use(cors(this.options))
        this.app.use(bodyParser.json())
        this.app.use(bodyParser.urlencoded({
            limit: '50mb',
            extended: false,
            parameterLimit: 1000000
        }))
        this.app.use(fileUpload())
    }
}

export default new App().app
