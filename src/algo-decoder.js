require("google-closure-library");
goog.require('goog.string');
goog.require('goog.json');

module.exports = function(content) {
    const begin_definition = content.indexOf('-----BEGIN ALGO DEFINITION-----');
    const end_definition = content.indexOf('-----END ALGO DEFINITION-----');

    const begin_algo = content.indexOf('-----BEGIN ALGO-----');
    const end_algo = content.indexOf('-----END ALGO-----');

    if (begin_definition < 0 || end_definition < 0
        || begin_algo < 0 || end_algo < 0) {
        throw 'Invalid algorithm definition';
    }

    var algo_definition
        = content.substring(begin_definition + 31, end_definition);
    algo_definition = goog.string.stripNewlines(algo_definition);

    var algorithm = goog.json.parse(algo_definition);

    if (!goog.isDefAndNotNull(algorithm)) {
        throw 'Invalid algorithm definition';
    }

    if (!goog.isDefAndNotNull(algorithm['id'])) {
        throw 'Invalid field:id';
    }

    if (!goog.isDefAndNotNull(algorithm['description'])) {
        throw 'Invalid field:description';
    }

    if (!goog.isDefAndNotNull(algorithm['params'])) {
        throw 'Invalid field:params';
    }

    if (!goog.isDefAndNotNull(algorithm['constructor'])) {
        throw 'Invalid field:constructor';
    }

    if (!goog.isDefAndNotNull(algorithm['destructor'])) {
        throw 'Invalid field:destructor';
    }

    return [algorithm, content.substring( begin_algo + 20, end_algo)];
};
