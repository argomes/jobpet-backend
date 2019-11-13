import { LeadController } from './../controllers/lead.controller';
export class LeadRouter {
    public controller: LeadController = new LeadController()
    public routes(app): void{
        app.route('/lead')
            .post(this.controller.add)
            .get(this.controller.find)
    }
}