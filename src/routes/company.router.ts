import { CompanyController } from './../controllers/company.controller'

export class CompanyRouter {
    public Controller: CompanyController = new CompanyController()

    public routes(app): void {   
        app.route('/company')
            .get(this.Controller.find)
            .post(this.Controller.add)
            .put(this.Controller.update)
            .delete(this.Controller.remove)
    }
}
