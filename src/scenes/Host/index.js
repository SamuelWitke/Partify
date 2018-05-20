export default store => ({
  /*  Async getComponent is only invoked when route matches   */
   path: 'Host/', 
   getChildRoutes(partialNextState, cb) {
    require.ensure([], require => {
      /*  Webpack - use require callback to define
          dependencies for bundling   */
      const Songs = require('./containers/Host.js').default
      const List = require('./containers/List.js').default

      /*  Return getComponent   */
        cb(null, [Songs(store)])
        cb(null, [List(store)])
    })
  }
})
