//Nodeunit tests
var middleware = require('../middleware');

exports['require'] = {
  'returns a BadRequest error if params are missing - on req.body': function(test) {
    var req = {
      body: {}
    };

    var fn = middleware.require('body', ['name', 'user.id']);

    fn(req, {}, function(err) {
      test.same(err.name, 'BadRequest');
      test.same(err.statusCode, 400);
      test.same(err.errors.name, 'required');
      test.same(err.errors['user.id'], 'required');

      test.done();
    });
  },

  'returns a BadRequest error if params are missing - on req.query': function(test) {
    var req = {
      query: { foo: 'bar' }
    };

    var fn = middleware.require('query', ['q', 'page']);

    fn(req, {}, function(err) {
      test.same(err.name, 'BadRequest');
      test.same(err.statusCode, 400);
      test.same(err.errors.q, 'required');
      test.same(err.errors.page, 'required');

      test.done();
    });
  },

  'returns no error if params are present': function(test) {
    var req = {
      body: { foo: 'bar' }
    };

    var fn = middleware.require('body', ['foo']);

    fn(req, {}, function(err) {
      test.same(err, undefined);

      test.done();
    });
  }
};
