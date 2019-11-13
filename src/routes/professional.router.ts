import { AuthController } from './../controllers/authentication.controller';
import { ProfessionalController } from './../controllers/professional.controller'

export class ProfessionalRouter {
    public Controller: ProfessionalController = new ProfessionalController()
    public authController: AuthController = new AuthController();
    public routes(app): void {
        app.route('/professional')
            .get(this.authController.validationToken, this.Controller.find)
            .post(this.Controller.add)
            .put(this.authController.validationToken, this.Controller.update)
            .delete(this.authController.validationToken, this.Controller.remove)
        app.route('/professional/professional_experience')
            .get(this.Controller.findWorkExperience)    
    }
}
