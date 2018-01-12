const
  age = 63072000
, frame = 'deny'
, transport = [`max-age=${age}`, 'includeSubDomains', 'preload'].join `; `


module.exports = options =>

  async (context, next) => {
    await next ()

    context.set
      ('x-frame-options', frame)

    context.set
      ('strict-transport-security', transport)
  }
