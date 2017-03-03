
var uninitialized = {};

var object = function object(obj){
	for (var key in obj){
		var value = obj[key];
		if (isComputed(value)){
			value.object = obj;
			value.name = key;
		}
	}
	return obj;
};

var computedGet = function(propertyName) {
	return get(this.object, propertyName, this);
};

var computed = function computed(){
	var compute = arguments[arguments.length - 1];
	var result = {
		value: uninitialized,
		version: {},
		isDirty: true,
		dependencies: new Map(),
		dependents: new Set(),
		__isComputed__: true,
		get: computedGet,
	};
	if (typeof(compute) !== 'function'){
		result.dirtyValue = compute;
		result.compute = function() {
			return result.dirtyValue;
		};
	} else {
		result.compute = compute;
	}
	return result;
};

var isComputed = function isComputed(arg) {
	return arg && arg.__isComputed__;
};

var set = function set(obj, propertyName, propertyValue){
	var value = obj[propertyName];
	if (isComputed(value)) {
		if (value.value === propertyValue){
			return;
		}
		value.dirtyValue = propertyValue;
		var nodesToMark = [value];
		while (nodesToMark.length) {
			var node = nodesToMark.pop();
			if (!node.isDirty) {
				node.isDirty = true;
				nodesToMark = nodesToMark.concat(Array.from(node.dependents.values()));
			}
		}
	} else {
		obj[propertyName] = propertyValue;
	}
};

var setComputedDependency = function setComputedDependency(computed, dependency) {
	if (!computed){
		return;
	}
	computed.dependencies.set(dependency, dependency.version);
	dependency.dependents.add(computed);
}

var get = function get(object, propertyName, dependentComputed){
	if (propertyName.indexOf('.') !== -1){
		var baseDependentProperty = dependentComputed;
		var parts = propertyName.split('.');
		while (parts.length) {
			var part = parts.shift();
			var nextObject = get(object, part, dependentComputed);
			object = nextObject;
		}
		return object;
	}
	var result = object[propertyName];
	if (isComputed(result)){
		if (result.isDirty){
			getComputed(result);
			// getNaieveComputed(result);
		}
		setComputedDependency(dependentComputed, result);
		return result.value;
	} else {
		return result;
	}
};

var getComputed = function getComputed(computed){
	if (recomputeDirty(computed)){
		recompute(computed);
	} else {
		computed.isDirty = false;
	}
};

var getNaieveComputed = function getNaieveComputed(computed){
	recompute(computed);
};

var recompute = function recompute(computed){
	var recomputed = computed.compute.call(computed);
	if (recomputed !== computed.value){
		computed.value = recomputed;
		computed.version = {};
	}
	computed.isDirty = false;
};

var recomputeDirty = function recompute(computed){
	if (computed.value === uninitialized || (computed.dirtyValue && computed.dirtyValue !== computed.value)){
		return true;
	}
	var dependencies = Array.from(computed.dependencies.keys());
	for (var i = 0; i < dependencies.length; i++) {
		var dependency = dependencies[i];
		if (getVersion(dependency) !== computed.dependencies.get(dependency)){
			return true;
		}
	}
	return false;
};

var getVersion = function getVersion(computed){
	getComputed(computed);
	return computed.version;
};

module.exports = {
	object: object,
	get: get,
	set: set,
	computed: computed,
};
