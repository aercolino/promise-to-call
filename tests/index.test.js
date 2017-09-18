const chai = require('chai');
const sinon = require('sinon');
const sinonTest = require('sinon-test')(sinon);
const sinonChai = require('sinon-chai');
const chaiAsPromised = require("chai-as-promised");

const promiseTo = require('../src/index.js');
const newFixtures = require('./fixtures');
 
chai.use(sinonChai);
chai.use(chaiAsPromised);
const { expect } = chai;

let fixtures;
beforeEach(() => {
	promiseTo.usePromiseClass();
	fixtures = newFixtures();
});

describe('promise-to-call', function () {

	describe('usePromiseClass', function () {

		const SomePromiseClass = function (executor) {
			executor(() => {}, () => {});
		};
		const SomeOtherClassNoExecutor = function () {};
		const SomeOtherClassNoResolve = function (executor) {
			executor('oops', () => {});
		};
		const SomeOtherClassNoReject = function (executor) {
			executor(() => {});
		};
		const NotNewable = 'oops';

		it('should set the promise class', sinonTest(function (done) {
			promiseTo.usePromiseClass(SomePromiseClass);
			const result = promiseTo.$callFunction(() => {});
			expect(result).to.be.an.instanceof(SomePromiseClass);
			done();
		}));

		it('should throw when the promise class is not new-able', sinonTest(function (done) {
			const test = () => { promiseTo.usePromiseClass(NotNewable); }
			expect(test).to.throw(/new-able/);
			done();
		}));

		it('should throw when the promise executor is not called immediately', sinonTest(function (done) {
			const test = () => { promiseTo.usePromiseClass(SomeOtherClassNoExecutor); }
			expect(test).to.throw(/immediately called/);
			done();
		}));

		it('should throw when the 1st arg of the promise executor is not a function', sinonTest(function (done) {
			const test = () => { promiseTo.usePromiseClass(SomeOtherClassNoResolve); }
			expect(test).to.throw(/1st arg/);
			done();
		}));

		it('should throw when the 2nd arg of the promise executor is not a function', sinonTest(function (done) {
			const test = () => { promiseTo.usePromiseClass(SomeOtherClassNoReject); }
			expect(test).to.throw(/2nd arg/);
			done();
		}));

		it('should be idempotent when using Promise', sinonTest(function (done) {
			const resultBefore = promiseTo.$callFunction(() => {});
			promiseTo.usePromiseClass(Promise);
			const resultAfter = promiseTo.$callFunction(() => {});
			expect(resultBefore).to.be.an.instanceof(Promise);
			expect(resultAfter).to.be.an.instanceof(Promise);
			done();
		}));

	});

	describe('$callMethod', function () {

		it('should return a Promise', sinonTest(function (done) {
			const result = promiseTo.$callMethod(fixtures.someObject, 'someMethod', 2, 3);
			expect(result).to.respondTo('then');
			done();
		}));

		it('should call the method with the given arguments', sinonTest(function (done) {
			const stub = this.stub();
			fixtures.someObject.someMethod = stub;
			promiseTo.$callMethod(fixtures.someObject, 'someMethod', 2, 3);
			expect(stub).to.have.been.calledWith(2, 3);
			done();
		}));

		it('should resolve with the data passed to the callback', sinonTest(function () {
			const result = promiseTo.$callMethod(fixtures.someObject, 'someMethod', 2, 3);
			return expect(result).to.eventually.eql({a:'hey', b:2, c:3});
		}));

		it('should reject with the error passed to the callback', sinonTest(function () {
			const result = promiseTo.$callMethod(fixtures.someObject, 'someMethod', 2, null);
			return expect(result).to.eventually.be.rejectedWith('Expected a `c`');
		}));

	});

	describe('$callFunction', function () {

		it('should return a Promise', sinonTest(function (done) {
			const result = promiseTo.$callFunction(fixtures.someFunction, 2, 3);
			expect(result).to.respondTo('then');
			done();
		}));

		it('should call the function with the given arguments', sinonTest(function (done) {
			const stub = this.stub();
			fixtures.someFunction = stub;
			promiseTo.$callFunction(fixtures.someFunction, 2, 3);
			expect(stub).to.have.been.calledWith(2, 3);
			done();
		}));

		it('should resolve with the data passed to the callback', sinonTest(function () {
			const result = promiseTo.$callFunction(fixtures.someFunction, 2, 3);
			return expect(result).to.eventually.eql({b:2, c:3});
		}));

		it('should reject with the error passed to the callback', sinonTest(function () {
			const result = promiseTo.$callFunction(fixtures.someFunction, 2, null);
			return expect(result).to.eventually.be.rejectedWith('Expected a `c`');
		}));

	});

});
