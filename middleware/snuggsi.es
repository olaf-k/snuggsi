// Content Negotiation
//
//   References:
//     WHATWG URL Spec - https://url.spec.whatwg.org
//     Wikipedia - https://en.wikipedia.org/wiki/Content_negotiation
//     MDN - https://developer.mozilla.org/en-US/docs/Web/HTTP/Content_negotiation
//     HTTP Accept Header - https://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.1

const
  suffix = 'min'
, root   = './dist'
, name   = 'snuggsi'
, send   = require ('koa-send')


module.exports = async (context, next) =>
{
  const
    debug
      = 'debug' in context.request.query

  , accept // HTTP 1.1 `Accept` Header
      // - https://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.1
      // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Encoding
      = context.get ('Accept')

  , brotli // HTTP1.1 `Accept-Encoding` Header
      // http://tools.ietf.org/html/7231#section-5.3.4
      = !!! debug
        &&  !! context.acceptsEncodings (['br'])

  , gzip // HTTP1.1 `Accept-Encoding` Header
      // http://tools.ietf.org/html/7231#section-5.3.4
      = !!! debug
        &&  !! context.acceptsEncodings (['*', 'gzip'])

  , snuggsi
      = /^\/snuggsi(\.es|\.js)*$/
        .test (context.path)

  , extension
      = (context.path.match (/\.(es|js)$/) || []) [1]
        || (brotli ? 'es' : 'js')

  , minified =
      ( gzip || brotli )
        ? suffix : ''

  , resource =
      [ name, minified, extension ]
        .filter (Boolean)
        .join `.`

  , options
      = { root , gzip, brotli }

  , settings
      = [context, resource, options]


  console.warn ('\n\npath', context.path, extension, accept, resource, options, context.get ('Accept-Encoding'), debug)
  !! // void

  snuggsi
    ? await send ( ... settings )
      && extension === 'es'
      && context.set ('Content-Type', 'application/ecmascript; charset=utf-8')
    : await next ()
}
