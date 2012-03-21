var errors = require('./errors'),
    _ = require('pow-underscore');

/**
 * Respond with a BadRequest error if the request is missing any required parameters.
 * Allowed parameters are defined as paths to support nested objects, (e.g. 'obj.attribute')
 * This method will add the transformed paths onto the request object. For example, body request 
 * params will be added to req.bodyPaths
 * 
 * @param {String} type               Part of the request to look for the params ('query', 'param', 'body')
 * @param {String[]} requiredPaths    Paths to require (e.g. 'name', 'address.ln1')
 */
exports.require = function require(type, requiredPaths) {
  return function(req, res, next) {
    var data = req[type] || {},
        paths = _.flatten(data);

        console.log(data, paths)

    var errs = {},
        hasError = false,
        key;
    
    //Collect errors
    for (var i = 0, len = requiredPaths.length; i < len; i++) {
      key = requiredPaths[i];

      //Check if it's there as an object
      if (typeof data[key] !== 'undefined') continue;

      //Otherwise check as full path
      if (typeof paths[key] === 'undefined') {
        errs[key] = 'required';
        hasError = true;
      }
    }
    
    if (hasError) return next(new errors.BadRequest(null, errs));
    
    next();
  }
};
