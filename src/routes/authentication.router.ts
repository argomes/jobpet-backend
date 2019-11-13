import { AuthController } from './../controllers/authentication.controller'

export class AuthenticationRouter {
    public authController: AuthController = new AuthController()

    public routes(app): void {
        app.route('/login')
            .post(this.authController.authenticateUser)
    }
}   