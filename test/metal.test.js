

var metal = require('../src/metal.js')
var expect = require('chai').expect;

describe('get', function() {
	it('will work with a raw value', function() {
		expect(metal.get(metal.object({foo: 2}), 'foo')).to.equal(2);
	});

	it('will work with a constant computed', function() {
		expect(metal.get(metal.object({foo: metal.computed(2)}), 'foo')).to.equal(2);
	});

	it('will work with a computed function', function() {
		expect(metal.get(metal.object({foo: metal.computed(function(){ return 2;})}), 'foo')).to.equal(2);
	});

	it('will work with a computed function which depends on a property', function() {
		var obj = metal.object({
			foo: metal.computed(1),
			bar: metal.computed(function(){
				return this.get('foo') + 1;
			}),
		});
		expect(metal.get(obj, 'bar')).to.equal(2);
	});

	it('will work with a computed function which depends on another computed property', function() {
		var obj = metal.object({
			foo: metal.computed(1),
			bar: metal.computed(function(){
				return this.get('foo') + 1;
			}),
			baz: metal.computed(function(){
				return this.get('bar') + 1;
			}),
		});
		expect(metal.get(obj, 'baz')).to.equal(3);
	});

	it('will work with a computed function which depends on a nested computed property', function() {
		var obj = metal.object({
			foo: metal.computed(metal.object({
				hash: metal.computed(1),
				yolo: metal.computed(function(){
					return this.get('hash');
				})
			})),
			bar: metal.computed(function(){
				return this.get('foo.yolo') + 1;
			}),
		});
		expect(metal.get(obj, 'bar')).to.equal(2);
	});
});

describe('set', function() {
	it('will work with a raw value', function() {
		var obj = metal.object({foo: 2});
		metal.set(obj, 'foo', 3);
		expect(metal.get(obj, 'foo')).to.equal(3);
	});

	it('will work with a constant computed', function() {
		var obj = metal.object({foo: metal.computed(2)});
		metal.set(obj, 'foo', 3);
		expect(metal.get(obj, 'foo')).to.equal(3);
	});

	it('will work with a computed function which depends on a property', function() {
		var obj = metal.object({
			foo: metal.computed(1),
			bar: metal.computed(function(){
				return this.get('foo') + 1;
			}),
		});
		expect(metal.get(obj, 'bar')).to.equal(2);
		metal.set(obj, 'foo', 2);
		expect(metal.get(obj, 'bar')).to.equal(3);
	});

	it('will work with a computed function which depends on another computed property', function() {
		var obj = metal.object({
			foo: metal.computed(1),
			bar: metal.computed(function(){
				return this.get('foo') + 1;
			}),
			baz: metal.computed(function(){
				return this.get('bar') + 1;
			}),
		});
		expect(metal.get(obj, 'baz')).to.equal(3);
		metal.set(obj, 'foo', 2);
		expect(metal.get(obj, 'baz')).to.equal(4);
	});

	it('will work with a computed function which depends on a nested computed property', function() {
		var obj = metal.object({
			foo: metal.computed(metal.object({
				hash: metal.computed(1),
				yolo: metal.computed(function(){
					return this.get('hash');
				})
			})),
			bar: metal.computed(function(){
				return this.get('foo.yolo') + 1;
			}),
		});
		expect(metal.get(obj, 'bar')).to.equal(2);
		metal.set(metal.get(obj, 'foo'), 'hash', 2);
		expect(metal.get(obj, 'bar')).to.equal(3);
	});

	it('will not recompute if the immediate set value hasnt changed', function() {
		var computeCount = 0;
		var obj = metal.object({
			foo: metal.computed(1),
			bar: metal.computed(function(){
				computeCount++;
				return this.get('foo') + 1;
			}),
			baz: metal.computed(function(){
				return this.get('bar') + 1;
			}),
		});
		expect(metal.get(obj, 'baz')).to.equal(3);
		expect(computeCount).to.equal(1);
		metal.set(obj, 'foo', 1);
		expect(metal.get(obj, 'baz')).to.equal(3);
		expect(computeCount).to.equal(1);
	});

	it('will not recompute if an intermediate property value hasnt changed', function() {
		var computeCount = 0;
		var obj = metal.object({
			foo: metal.computed(2),
			bar: metal.computed(function(){
				return Math.floor(this.get('foo') / 2);
			}),
			baz: metal.computed(function(){
				computeCount++;
				return this.get('bar') + 1;
			}),
		});
		expect(metal.get(obj, 'baz')).to.equal(2);
		expect(computeCount).to.equal(1);
		metal.set(obj, 'foo', 3);
		expect(metal.get(obj, 'baz')).to.equal(2);
		expect(computeCount).to.equal(1);
	});
});
