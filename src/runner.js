require("google-closure-library");

// Imports that are part of the algo trading interface.
// From
// <https://github.com/blinktrade/algorithm-trading/blob/f6a02a4e05f6fa9846c13538612b4976dd2eec18/algorithm_application.js>
// {{{

goog.exportSymbol('goog.bind', goog.bind);
goog.exportSymbol('goog.isDefAndNotNull', goog.isDefAndNotNull);
goog.exportSymbol('goog.typeOf',goog.typeOf);
goog.exportSymbol('goog.isDef',goog.isDef);
goog.exportSymbol('goog.isNull',goog.isNull);
goog.exportSymbol('goog.isArray',goog.isArray);
goog.exportSymbol('goog.isArrayLike',goog.isArrayLike);
goog.exportSymbol('goog.isDateLike',goog.isDateLike);
goog.exportSymbol('goog.isString',goog.isString);
goog.exportSymbol('goog.isBoolean',goog.isBoolean);
goog.exportSymbol('goog.isNumber',goog.isNumber);
goog.exportSymbol('goog.isFunction',goog.isFunction);
goog.exportSymbol('goog.isObject',goog.isObject );
goog.exportSymbol('goog.cloneObject',goog.cloneObject);
goog.exportSymbol('goog.partial',goog.partial);
goog.exportSymbol('goog.mixin',goog.mixin);
goog.exportSymbol('goog.now',goog.now);
goog.exportSymbol('goog.globalEval',goog.globalEval);
goog.exportSymbol('goog.inherits',goog.inherits);
goog.exportSymbol('goog.base',goog.base);

goog.exportSymbol('goog.array', goog.array);
goog.exportSymbol('goog.array.splice', goog.array.splice);
goog.exportSymbol('goog.array.insertAt', goog.array.insertAt);
goog.exportSymbol('goog.array.indexOf', goog.array.indexOf);
goog.exportSymbol('goog.array.lastIndexOf',goog.array.lastIndexOf);
goog.exportSymbol('goog.array.forEach',goog.array.forEach);
goog.exportSymbol('goog.array.forEachRight',goog.array.forEachRight);
goog.exportSymbol('goog.array.filter',goog.array.filter);
goog.exportSymbol('goog.array.map',goog.array.map);
goog.exportSymbol('goog.array.reduce',goog.array.reduce);
goog.exportSymbol('goog.array.reduceRight',goog.array.reduceRight);
goog.exportSymbol('goog.array.some',goog.array.some);
goog.exportSymbol('goog.array.every',goog.array.every);
goog.exportSymbol('goog.array.count',goog.array.count);
goog.exportSymbol('goog.array.findIndex',goog.array.findIndex);
goog.exportSymbol('goog.array.findRight',goog.array.findRight);
goog.exportSymbol('goog.array.findIndexRight',goog.array.findIndexRight);
goog.exportSymbol('goog.array.contains',goog.array.contains);
goog.exportSymbol('goog.array.isEmpty',goog.array.isEmpty);
goog.exportSymbol('goog.array.clear',goog.array.clear);
goog.exportSymbol('goog.array.insert',goog.array.insert);
goog.exportSymbol('goog.array.insertArrayAt',goog.array.insertArrayAt);
goog.exportSymbol('goog.array.insertBefore',goog.array.insertBefore);
goog.exportSymbol('goog.array.remove',goog.array.remove);
goog.exportSymbol('goog.array.removeAt',goog.array.removeAt);
goog.exportSymbol('goog.array.removeIf',goog.array.removeIf);
goog.exportSymbol('goog.array.concat',goog.array.concat);
goog.exportSymbol('goog.array.toArray',goog.array.toArray);
goog.exportSymbol('goog.array.clone',goog.array.clone);
goog.exportSymbol('goog.array.extend',goog.array.extend);
goog.exportSymbol('goog.array.slice',goog.array.slice);
goog.exportSymbol('goog.array.removeDuplicates',goog.array.removeDuplicates);
goog.exportSymbol('goog.array.binarySearch',goog.array.binarySearch);
goog.exportSymbol('goog.array.binarySelect',goog.array.binarySelect);
goog.exportSymbol('goog.array.sort',goog.array.sort);
goog.exportSymbol('goog.array.stableSort',goog.array.stableSort);
goog.exportSymbol('goog.array.sortObjectsByKey',goog.array.sortObjectsByKey);
goog.exportSymbol('goog.array.isSorted',goog.array.isSorted);
goog.exportSymbol('goog.array.equals',goog.array.equals);
goog.exportSymbol('goog.array.compare3',goog.array.compare3);
goog.exportSymbol('goog.array.defaultCompare',goog.array.defaultCompare);
goog.exportSymbol('goog.array.defaultCompareEquality',goog.array.defaultCompareEquality);
goog.exportSymbol('goog.array.binaryInsert',goog.array.binaryInsert);
goog.exportSymbol('goog.array.binaryRemove',goog.array.binaryRemove);
goog.exportSymbol('goog.array.bucket',goog.array.bucket);
goog.exportSymbol('goog.array.toObject',goog.array.toObject);
goog.exportSymbol('goog.array.range',goog.array.range);
goog.exportSymbol('goog.array.repeat',goog.array.repeat);
goog.exportSymbol('goog.array.flatten',goog.array.flatten);
goog.exportSymbol('goog.array.rotate',goog.array.rotate);
goog.exportSymbol('goog.array.zip',goog.array.zip)
goog.exportSymbol('goog.array.shuffle',goog.array.shuffle);

goog.exportSymbol('goog.object', goog.object);
goog.exportSymbol('goog.object.forEach', goog.object.forEach);
goog.exportSymbol('goog.object.extend', goog.object.extend);
goog.exportSymbol('goog.object.filter',goog.object.filter);
goog.exportSymbol('goog.object.map',goog.object.map);
goog.exportSymbol('goog.object.some',goog.object.some);
goog.exportSymbol('goog.object.every',goog.object.every);
goog.exportSymbol('goog.object.getCount',goog.object.getCount);
goog.exportSymbol('goog.object.getAnyKey',goog.object.getAnyKey);
goog.exportSymbol('goog.object.getAnyValue',goog.object.getAnyValue);
goog.exportSymbol('goog.object.contains',goog.object.contains);
goog.exportSymbol('goog.object.getValues',goog.object.getValues);
goog.exportSymbol('goog.object.getKeys',goog.object.getKeys);
goog.exportSymbol('goog.object.getValueByKeys',goog.object.getValueByKeys);
goog.exportSymbol('goog.object.containsKey',goog.object.containsKey);
goog.exportSymbol('goog.object.containsValue',goog.object.containsValue);
goog.exportSymbol('goog.object.findKey',goog.object.findKey);
goog.exportSymbol('goog.object.findValue',goog.object.findValue);
goog.exportSymbol('goog.object.isEmpty',goog.object.isEmpty);
goog.exportSymbol('goog.object.clear',goog.object.clear);
goog.exportSymbol('goog.object.remove',goog.object.remove);
goog.exportSymbol('goog.object.add',goog.object.add);
goog.exportSymbol('goog.object.get',goog.object.get);
goog.exportSymbol('goog.object.set',goog.object.set);
goog.exportSymbol('goog.object.setIfUndefined',goog.object.setIfUndefined);
goog.exportSymbol('goog.object.clone',goog.object.clone);
goog.exportSymbol('goog.object.unsafeClone',goog.object.unsafeClone);
goog.exportSymbol('goog.object.transpose',goog.object.transpose);
goog.exportSymbol('goog.object.create',goog.object.create);
goog.exportSymbol('goog.object.createSet',goog.object.createSet);
goog.exportSymbol('goog.object.createImmutableView',goog.object.createImmutableView);
goog.exportSymbol('goog.object.isImmutableView',goog.object.isImmutableView);

// }}}

module.exports.getAlgoObj = function(contents, ctor, application, symbol) {
    eval(contents);
    return eval(ctor + '(application, symbol)');
};
