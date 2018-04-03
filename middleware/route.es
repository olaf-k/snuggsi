const
  decode = decodeURIComponent
  // https://coderwall.com/p/y347ug/encodeuri-vs-encodeuricomponent

, characters
    = '([()A-Za-z%0-9\*\-\_]+)'

, tokens
    = [ /{\w+}/g, characters ]

, capture = uri =>
    new RegExp (`^${ uri.replace ( ... tokens ) }$`)

, parameterize = (match, context, tokens) => {
    'params' in context
      || (context.params = {})

    void []
      .splice.call (context.path.match (match), 1)
      .map ((value, index) =>
        context.params [tokens [index]] = decode (value))

    return context
  }


module.exports = (uri, resource, tokens, match) => {

  tokens = uri.match (/[^{]+(?=})/g)

  return async (context, next, handle, { method } = context) => {

    handle = resource [method.toLowerCase ()] || resource

    const
      identify = handle.length > 1
    , trailing = uri.slice (-1) === '/'
    // https://cdivilly.wordpress.com/2014/03/11/why-trailing-slashes-on-uris-are-important/

    match  = capture (uri)

    console.warn ('context: %s \n path: %s \n\n', context, context.path)
    console.warn (trailing, identify)

    match.test (context.path)
      ? await handle (parameterize (match, context, tokens))
      : await next (context)
  }
}
