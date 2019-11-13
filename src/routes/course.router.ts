import { CourseController } from './../controllers/course.controller'

export class CourseRouter {
    public Controller: CourseController = new CourseController()

    public routes(app): void {   
        app.route('/course')
            .get(this.Controller.find)
            .post(this.Controller.add)
            .put(this.Controller.update)
            .delete(this.Controller.remove)
    }
}
