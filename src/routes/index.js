// We only need to import the modules necessary for initial render
import CoreLayout from '../layouts/CoreLayout'
import Home from '../scenes/Home'
import LoginRoute from '../scenes/Login'
import SignupRoute from '../scenes/Signup'
import ProjectsRoute from '../scenes/Projects'
import AccountRoute from '../scenes/Account'
import RecoverRoute from '../scenes/Recover'
import NotFoundRoute from '../scenes/NotFound'
import HostRoute from '../scenes/Host'
import ProjectRoute from '../scenes/Projects/routes/Project'


/*  Note: Instead of using JSX, we recommend using react-router
    PlainRoute objects to build route definitions.   */

export const createRoutes = store => ({
  path: '/',
  component: CoreLayout,
  indexRoute: Home,
  childRoutes: [
    AccountRoute,
    LoginRoute,
    SignupRoute,
    HostRoute(store),
    ProjectsRoute(store), // async route definitions recieve store
    ProjectRoute(store), // async route definitions recieve store
    RecoverRoute(store), // async route definitions recieve store
    /* Place all Routes above here so NotFoundRoute can act as a 404 page */
    NotFoundRoute(store) // async route definitions recieve store
  ]
})

export default createRoutes
