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
};

QUnit.assert.strictEqualDb = function(dbActual, dbExpected, message) {
	var isEqual = strictEqualDb(dbActual, dbExpected);
	this.push( isEqual, dbActual, dbExpected, message );
};

QUnit.assert.strictEqualDbs = function(dbActuals, dbExpecteds, message) {
	var isEqual =
		dbActuals.length === dbExpecteds.length &&
		pl.all(_.zip(dbActuals, dbExpecteds), function(dbs) {
			return strictEqualDb(dbs[0], dbs[1]);
		});
	this.push( isEqual, dbActuals, dbExpecteds, message );
};

QUnit.test('can add databases', function(assert) {

	var dbs = [
        {
            host: 'notsecurebank.com',
            port: '3141',
            schema: 'account',
            user: 'notlogin',
            password: 'notpassword'
        },
        {
            host: 'gluten-free.com',
            port: '7222',
            schema: 'breads',
            user: 'ilovegluten',
            password: 'eatbreadalways'
        },
        {
            host: 'hamshoulder.com',
            port: '6776',
            schema: 'meats',
            user: 'meatman',
            password: 'meatman'
        }
    ];

    var done3 = assert.async();
	pl.DbItemStore.addChangeListener(plt.once(3, function() {
		assert.strictEqualDbs(pl.DbItemStore.getDatabases(), dbs, 'databases should have been added');
		done3();
	}));

    dbs.forEach(function(db) {
	    pl.DbItemActions.add(db);
	});
});

QUnit.test('can remove databases', function(assert) {

	var dbs = [
        {
            host: 'notsecurebank.com',
            port: '3141',
            schema: 'account',
            user: 'notlogin',
            password: 'notpassword'
        },
        {
            host: 'gluten-free.com',
            port: '7222',
            schema: 'breads',
            user: 'ilovegluten',
            password: 'eatbreadalways'
        },
        {
            host: 'hamshoulder.com',
            port: '6776',
            schema: 'meats',
            user: 'meatman',
            password: 'meatman'
        }
    ];

    var newDbs = pl.update(dbs, {$splice: [[1,1]]});

    var done4 = assert.async();
	pl.DbItemStore.addChangeListener(plt.once(4, function() {
		assert.strictEqualDbs(pl.DbItemStore.getDatabases(), newDbs, 'a database should have been removed');
		done4();
	}));

    dbs.forEach(function(db) {
	    pl.DbItemActions.add(db);
	});

	pl.DbItemActions.remove(1);
});

QUnit.test('can edit a database', function(assert) {

	var db = {
        host: 'gluten-free.com',
        port: '7222',
        schema: 'breads',
        user: 'ilovegluten',
        password: 'eatbreadalways'
    };

	var done2 = assert.async();
	pl.DbItemStore.addChangeListener(plt.once(2, function() {

		var dbItems = pl.DbItemStore.getDbItems();
		assert.strictEqual(dbItems.length, 1, 'should only be one dbItem');

		var dbItem = dbItems[0];
		assert.strictEqual(db.id, 0, 'first dbItem should have id 0');
		assert.strictEqualDb(dbItem.db, db, 'first dbItem should be added db');
		assert.strictEqual(dbItem.state, pl.DbItemStore.STATE_EDIT, 'first dbItem should be in edit mode');
		done2();
	}));

    pl.DbItemActions.add(db);
	pl.DbItemActions.edit(0);
});

QUnit.test('can cancel a database edit', function(assert) {

    var done2 = assert.async();
    pl.DbItemStore.addChangeListener(plt.once(2, function() {

		var dbItems = pl.DbItemStore.getDbItems();
		var dbItem = dbItems[0];
		assert.strictEqual(dbItem.state, pl.DbItemStore.STATE_EDIT, 'first dbItem should be in edit mode');
		done2();
	}));

    var done3 = assert.async();
	pl.DbItemStore.addChangeListener(plt.once(3, function() {

		var dbItems = pl.DbItemStore.getDbItems();
		var dbItem = dbItems[0];
		assert.strictEqual(dbItem.state, pl.DbItemStore.STATE_VIEW, 'first dbItem should be in view mode');
		done3();
	}));



    pl.DbItemActions.add({
        host: 'hamshoulder.com',
        port: '6776',
        schema: 'meats',
        user: 'meatman',
        password: 'meatman'
    });
	pl.DbItemActions.edit(0);
	pl.DbItemActions.cancelEdit(0);
});

