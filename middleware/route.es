const
  // decodeURI
  // since these are user defined best to decode everything
  // https://coderwall.com/p/y347ug/encodeuri-vs-encodeuricomponent
  [ decode, encode ]
    = [decodeURIComponent, encodeURIComponent]


module.exports = (uri, resource) => {

  const
    tokens =
      uri.match (/[^{]+(?=})/g)

  , expression = new RegExp
      (uri.replace (/{\w+}/g, '([A-Za-z%0-9\-\_]+)'))

  , test = expression.test
      .bind (expression)

  , parameterized = (context, params = {}) =>
      ('params' in context || (context.params = {}))
        && []
          .splice
          .call (context.path.match (expression), 1) // remove 1st
          .map  ((value, index) => context.params [tokens [index]] = decode (value))

        && context


  return async ( context, next, middleware ) => {
    middleware = resource
      [context.method.toLowerCase ()]
        || resource

    !!! test (context.path)
      ? await next (context)
      : await middleware (parameterized (context), next)
  }
}
