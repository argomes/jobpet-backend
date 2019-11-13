import { AuthController } from './../controllers/authentication.controller';
import { JobController } from './../controllers/job.controller'

export class JobRouter {
    public Controller: JobController = new JobController()
    public authController: AuthController = new AuthController()
    public routes(app): void {   
        app.route('/job')
            .get(this.authController.validationToken, this.Controller.find)
            .post(this.authController.validationToken, this.Controller.add)
            .put(this.authController.validationToken, this.Controller.update)
            .delete(this.authController.validationToken, this.Controller.remove)
    }
}
