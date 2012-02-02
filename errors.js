//Dependencies
var inherits = require('util').inherits;

// ==================================================================================
// ERRORS
// ==================================================================================

/**
 * Base (error to inherit from)
 */
var Base = exports.Base = function(msg) {
  this.name = 'Error';
  this.message = msg || 'Error';
  this.statusCode = 500;
  
  Error.call(this, this.message);
  Error.captureStackTrace(this, arguments.callee);
};

inherits(Base, Error);

Base.prototype.toJSON = function() {
  return {
    type: this.name,
    message: this.message
  };
};


/**
 * NotFound
 * @param {String}  Optional message
 */
var NotFound = exports.NotFound = function(msg) { 
  Base.call(this);
  
  this.name = 'NotFound';
  this.message = msg || 'Not found';
  this.statusCode = 404;
};

inherits(NotFound, Base);


/**
 * BadRequest
 * @param {String}  Optional message
 * @param {Object}  Optional dictionary of errors by fields e.g. { email: 'required' }
 */
var BadRequest = exports.BadRequest = function(msg, errors) { 
  Base.call(this);
  
  this.name = 'BadRequest';
  this.message = msg || 'Bad request';
  this.statusCode = 400;
  
  this.errors = errors;
};

inherits(BadRequest, Base);

BadRequest.prototype.toJSON = function() {
  return {
    type: this.name,
    message: this.message,
    errors: this.errors
  };
};


/**
 * Unauthorized
 * @param {String}  Optional message
 */
var Unauthorized = exports.Unauthorized = function(msg) { 
  Base.call(this);
  
  this.name = 'Unauthorized';
  this.message = msg || 'Not authorized';
  this.statusCode = 401;
};

inherits(Unauthorized, Base);


/**
 * Validation
 * @param {Object}  Fields/parameters and the error type e.g. { email: 'invalid' }
 * @param {String}  Optional message
 */
var Validation = exports.Validation = function(fields, msg) {
  Base.call(this);
  
  this.name = 'Validation';
  this.message = msg || 'Validation error';
  this.statusCode = 400;
  this.fields = fields;
}

inherits(Validation, Base);

Validation.prototype.toJSON = function() {
  return {
    type: this.name,
    fields: this.fields
  };
}


/**
 * Converts a Mongoose ValidationError to a custom ValidationError
 * @param {ValidationError}   Mongoose ValidationError (contains err.errors rather than err.fields)
 * @return {ValidationError}  Custom ValidationError
 */
Validation.createFromMongoose = function(err) {
  var fields = {};

  _.each(err.errors, function(item, key) {
    fields[key] = item.type;
  });

  return new Validation(fields);
};




// ==================================================================================
// ERROR HANDLER
// ==================================================================================

/**
 * API rror handler
 *
 * @param {Object}  options
 *
 * Options
 *     - dumpExceptions {Boolean}
 *     - showStack  {Boolean}
 */
exports.errHandler = function errHandler(options) {
  options = options || {};

  var dumpExceptions = options.dumpExceptions || false,
  showStack = options.showStack || false;

  return function(err, req, res, next) {
    if (dumpExceptions) {
      console.error(err);
      if (showStack) console.log(err.stack);
    }

    var statusCode = err.statusCode || 500;

    var response = {
      error: err
    };

    res.send(response, statusCode);
  }
};
