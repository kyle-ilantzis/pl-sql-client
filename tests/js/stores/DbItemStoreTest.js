QUnit.module('DbItemStoreTest', {

	beforeEach: function(assert) {

		pl.DbItemStore._init();

		assert.deepEqual(
			pl.DbItemStore.getDatabases(),
			[],
			'before each test databases should be empty'
		);
	}
});

var strictEqualDb = function(dbActual, dbExpected) {
	return dbActual.host === dbExpected.host &&
		dbActual.port === dbExpected.port &&
		dbActual.schema === dbExpected.schema &&
		dbActual.user === dbExpected.user &&
		dbActual.password === dbExpected.password;
}

QUnit.assert.strictEqualDbs = function(dbActuals, dbExpecteds, message) {
	var isEqual =
		dbActuals.length === dbExpecteds.length &&
		pl.all(_.zip(dbActuals, dbExpecteds), function(dbs) {
			return strictEqualDb(dbs[0], dbs[1]);
		});
	this.push( isEqual, dbActuals, dbExpecteds, message );
}

QUnit.test('can add a database', function(assert) {

	var done = assert.async();

	var db = {
		host: 'notsecurebank.com',
		port: '3141',
		schema: 'account',
		user: 'notlogin',
		password: 'notpassword'
	};

	pl.DbItemStore.addChangeListener(function() {
		console.log("actual", pl.DbItemStore.getDatabases())
		assert.strictEqualDbs(pl.DbItemStore.getDatabases(), [db], 'database should have been added');
		done();
	});

	pl.DbItemActions.add(db);
});