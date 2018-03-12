export default store => ({
  /*  Async getComponent is only invoked when route matches   */
    path: 'Host/', // TODO CHANGE PLZ
    //getComponent(nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    // require.ensure(
    //[],
    //require => {
        /*  Webpack - use require callback to define
          dependencies for bundling   */
    //   const Host = require('./containers/Songs.js').default

        /*  Return getComponent   */
    //   cb(null, Host)

        /* Webpack named bundle   */
    //     },
    // 'Host'
    // )
    //},
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
