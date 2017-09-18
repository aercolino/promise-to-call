
module.exports = () => ({

	someObject: {
		a: 'hey',
		someMethod(b, c, callback) {
			if (!c) {
				const err = new Error('Expected a `c`');
				callback(err);
				return;
			}
			const result = {a: this.a, b, c};
			callback(null, result);
		},
	},

	someFunction(b, c, callback) {
		if (!c) {
			const err = new Error('Expected a `c`');
			callback(err);
			return;
		}
		const result = {b, c};
		callback(null, result);
	},
	
});
