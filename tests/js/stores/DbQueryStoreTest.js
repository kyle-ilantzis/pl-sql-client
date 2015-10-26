QUnit.module('DbQueryStoreTest', {

    beforeEach: function(assert) {

        pl.DbItemStore._init();
        pl.DbQueryStore._init();

        assert.deepEqual( pl.DbItemStore.getDbUrls(), [], 'before each test should not have db urls' );
        assert.strictEqual( pl.DbQueryStore.isQuerying(), false, 'before each test should not be querying' )
        assert.strictEqual( pl.DbQueryStore.getMultiQueryResult(), null, 'before each test should not have results' );
    }
});

QUnit.test('DbQueryStore goes from querying to not querying', function(assert) {

    var done1 = assert.async();
    pl.DbQueryStore.addChangeListener(plt.once(1, function() {
        assert.strictEqual(pl.DbQueryStore.isQuerying(), true, 'should be querying');
        done1();
    }));

    var done2 = assert.async();
    pl.DbQueryStore.addChangeListener(plt.once(2, function() {
        assert.strictEqual(pl.DbQueryStore.isQuerying(), false, 'should not be querying');
        done2();
    }));

    pl.DbQueryActions.query('');
});

QUnit.test('a query with no databases is an error', function(assert) {

    var done2 = assert.async();
    pl.DbQueryStore.addChangeListener(plt.once(2, function() {
        var multiqueryResult = pl.DbQueryStore.getMultiQueryResult();
        assert.ok( multiqueryResult.error, 'should have an error');
        done2();
    }));

    pl.DbQueryActions.query('');
});

QUnit.test('an empty query is an error', function(assert) {

    var done2 = assert.async();
    pl.DbQueryStore.addChangeListener(plt.once(2, function() {
        var multiqueryResult = pl.DbQueryStore.getMultiQueryResult();
        assert.ok( multiqueryResult.error, 'should have an error');
        done2();
    }));

    pl.DbItemActions.add({
        dbType: pl.DbTypes.DB_TYPE_MYSQL,
        host: 'hamshoulder.com',
        port: '6776',
        schema: 'meats',
        user: 'meatman',
        password: 'meatman'
    });
    pl.DbQueryActions.query('');
});

QUnit.test('a query with databases returns a result for each database', function(assert) {

    var done2 = assert.async();
    pl.DbQueryStore.addChangeListener(plt.once(2, function() {
        var multiqueryResult = pl.DbQueryStore.getMultiQueryResult();
        assert.strictEqual( multiqueryResult.results.length, 2, 'should have 2 results, one for each db');
        done2();
    }));

    pl.DbItemActions.add({
        dbType: pl.DbTypes.DB_TYPE_MYSQL,
        host: 'hamshoulder.com',
        port: '6776',
        schema: 'meats',
        user: 'meatman',
        password: 'meatman'
    });
    pl.DbItemActions.add({
        dbType: pl.DbTypes.DB_TYPE_MYSQL,
        host: 'gluten-free.com',
        port: '7222',
        schema: 'breads',
        user: 'ilovegluten',
        password: 'eatbreadalways'
    });
    pl.DbQueryActions.query('SELECT * FROM users');
});

QUnit.test('each query is a new id', function(assert) {

    var id1;
    var id2;

    var done2 = assert.async();
    pl.DbQueryStore.addChangeListener(plt.once(2, function() {
        var multiqueryResult = pl.DbQueryStore.getMultiQueryResult();
        id1 = multiqueryResult.id;
        assert.ok( id1, 'a multiquery result should have an id');
        done2();

        pl.DbQueryActions.query('');
    }));

    var done4 = assert.async();
    pl.DbQueryStore.addChangeListener(plt.once(4, function() {
        var multiqueryResult = pl.DbQueryStore.getMultiQueryResult();
        var id2 = multiqueryResult.id;
        assert.notStrictEqual( id2, id1, 'each multiquery id should be different');
        done4();
    }));

    pl.DbQueryActions.query('SELECT * FROM users');
});

QUnit.test('a query with unreachable databases returns an error for each database', function(assert) {

    var done2 = assert.async();
    pl.DbQueryStore.addChangeListener(plt.once(2, function() {
        var multiqueryResult = pl.DbQueryStore.getMultiQueryResult();

        assert.strictEqual( multiqueryResult.results.length, 2, 'should have 2 results, one for each db');

        multiqueryResult.results.forEach(function(result) {
            assert.ok( result.error, 'result should have an error for unreachable db');
        });

        done2();
    }));

    pl.DbItemActions.add({
        dbType: pl.DbTypes.DB_TYPE_MYSQL,
        host: 'hamshoulder.com',
        port: '6776',
        schema: 'meats',
        user: 'meatman',
        password: 'meatman'
    });
    pl.DbItemActions.add({
        dbType: pl.DbTypes.DB_TYPE_MYSQL,
        host: 'gluten-free.com',
        port: '7222',
        schema: 'breads',
        user: 'ilovegluten',
        password: 'eatbreadalways'
    });
    pl.DbQueryActions.query('SELECT * FROM users');
});
