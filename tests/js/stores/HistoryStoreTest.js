QUnit.module('HistoryStoreTest', {

	beforeEach: function(assert) {

		pl.HistoryStore._init();

		assert.deepEqual(
			pl.HistoryStore.getQueryHistory(),
			[],
			'before each test query history should be empty'
		);
	}
});

QUnit.test('querying is remembered by HistoryStore', function(assert) {

	var sql = 'SELECT * FROM passwd';

	var done = assert.async();
	pl.HistoryStore.addChangeListener(function() {

		var queries = pl.HistoryStore.getQueryHistory();

		assert.strictEqual( queries.length, 1, 'queries must have 1 item');
		assert.strictEqual( queries[0].sql, sql, 'queries first item sql must be the query');

		done();
	});

	pl.DbQueryActions.query(sql);
});

QUnit.test('anything queried is remembered by HistoryStore', function(assert) {

	var sql = 'what is the meaning of life?';

	var done = assert.async();
	pl.HistoryStore.addChangeListener(function() {

		var queries = pl.HistoryStore.getQueryHistory();

		assert.strictEqual( queries.length, 1, 'queries must have 1 item');
		assert.strictEqual( queries[0].sql, sql, 'queries first item sql must be the arbitrary query');

		done();
	});

	pl.DbQueryActions.query(sql);
});

QUnit.test('empty queries is not remembered by HistoryStore', function(assert) {

	var sql = '';

	var done = assert.async();
	pl.HistoryStore.addChangeListener(function() {
		assert.notOk('no queries should have been remembered');
		done();
	});

	setTimeout(done, 1000);

	pl.DbQueryActions.query(sql);
});

QUnit.test('last query is the first in the history, ie the history is in reverse order', function(assert) {

	var sql1 = 'rm -r /';
	var sql2 = 'sudo make me a sandwhich';
	var sql3 = 'SELECT chunk FROM chunkyBacon where size > 5';

	var sqlCount = 3;

	var done = assert.async();
	pl.HistoryStore.addChangeListener(plt.once(sqlCount, function() {

		var queries = pl.HistoryStore.getQueryHistory();

		assert.strictEqual( queries.length, 3, 'queries must have 3 items');
		assert.strictEqual( queries[0].sql, sql3, 'first item sql must be the last query');
		assert.strictEqual( queries[1].sql, sql2, 'second item sql must be the before-last query');
		assert.strictEqual( queries[2].sql, sql1, 'last item sql must be the first query');

		done();
	}));

	pl.DbQueryActions.query(sql1);
	pl.DbQueryActions.query(sql2);
	pl.DbQueryActions.query(sql3);
});

QUnit.test('history items have unique ids', function(assert) {

	var sql1 = 'I am sql1';
	var sql2 = 'I am sql2';
	var sql3 = 'I am sql3';
	var sql4 = 'I am none of your business';

	var sqlCount = 4;

	var done = assert.async();
	pl.HistoryStore.addChangeListener(plt.once(sqlCount, function() {

		var queries = pl.HistoryStore.getQueryHistory();

		var ids = _.pluck(queries, 'id');
		var uniqueIds = _.uniq(ids);

		assert.strictEqual( uniqueIds.length, sqlCount, 'ids must be unique for each query');

		done();
	}));

	pl.DbQueryActions.query(sql1);
	pl.DbQueryActions.query(sql2);
	pl.DbQueryActions.query(sql3);
	pl.DbQueryActions.query(sql4);
});

QUnit.test('A limit of 0 cause nothing to be remembered by HistoryStore', function(assert) {

	pl.HistoryStore.HISTORY_LIMIT = 0;
	var sql = 'Peter Piper picked a peck of pickled peppers';

	var done = assert.async();
	pl.HistoryStore.addChangeListener(function() {

		var queries = pl.HistoryStore.getQueryHistory();

		assert.strictEqual(queries.length, 0, 'no queries should have been remembered');

		done();
	});

	pl.DbQueryActions.query(sql);
});

QUnit.test('A limit of 1 causes last query to be remembered by HistoryStore', function(assert) {

	pl.HistoryStore.HISTORY_LIMIT = 1;
	var sql = 'I LOVE SQL';
	var nosql = 'I HATE SQL, LONG LIVE NOSQL';

	var sqlCount = 2;

	var done = assert.async();
	pl.HistoryStore.addChangeListener(plt.once(sqlCount, function() {

		var queries = pl.HistoryStore.getQueryHistory();

		assert.deepEqual(queries.length, 1, 'only the last query should have been remembered');
		assert.deepEqual(queries[0].sql, nosql, 'the last query should have been remembered');

		done();
	}));

	pl.DbQueryActions.query(sql);
	pl.DbQueryActions.query(nosql);
});

QUnit.test('Last HISTORY_LIMIT queries are remembered by HistoryStore', function(assert) {

	pl.HistoryStore.HISTORY_LIMIT = 10;

	var sqls = _.range(1,20).map(function(i) { return "SQL " + i; });

	var sqlCount = sqls.length;

	var done = assert.async();
	pl.HistoryStore.addChangeListener(plt.once(sqlCount, function() {

		var queries = pl.HistoryStore.getQueryHistory();
		var querieSqls = _.pluck(queries, 'sql');

		var lastSqls = _.last(sqls, pl.HistoryStore.HISTORY_LIMIT).reverse();

		assert.deepEqual(querieSqls, lastSqls, 'the last queries should have been remembered');

		done();
	}));

	sqls.forEach(function(sql) {
		pl.DbQueryActions.query(sql);
	});
});