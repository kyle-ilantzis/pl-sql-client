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

	var done = assert.async();

	var sql = 'SELECT * FROM passwd';

	pl.HistoryStore.addChangeListener(function() {

		var queries = pl.HistoryStore.getQueryHistory();

		assert.strictEqual( queries.length, 1, 'queries must have 1 item');
		assert.strictEqual( queries[0].sql, sql, 'queries first item sql must be the query');

		done();
	});

	pl.DbQueryActions.query(sql);
});

QUnit.test('anything queried is remembered by HistoryStore', function(assert) {

	var done = assert.async();

	var sql = 'what is the meaning of life?';

	pl.HistoryStore.addChangeListener(function() {

		var queries = pl.HistoryStore.getQueryHistory();

		assert.strictEqual( queries.length, 1, 'queries must have 1 item');
		assert.strictEqual( queries[0].sql, sql, 'queries first item sql must be the arbitrary query');

		done();
	});

	pl.DbQueryActions.query(sql);
});

QUnit.test('last query is the first in the history, ie the history is in reverse order', function(assert) {

	var done = assert.async();

	var sql1 = 'rm -r /';
	var sql2 = 'sudo make me a sandwhich';
	var sql3 = 'SELECT chunk FROM chunkyBacon where size > 5';

	var i = 0;
	pl.HistoryStore.addChangeListener(function() {

		if (++i !== 3) { return; }

		var queries = pl.HistoryStore.getQueryHistory();

		assert.strictEqual( queries.length, 3, 'queries must have 3 items');
		assert.strictEqual( queries[0].sql, sql3, 'first item sql must be the last query');
		assert.strictEqual( queries[1].sql, sql2, 'second item sql must be the before-last query');
		assert.strictEqual( queries[2].sql, sql1, 'last item sql must be the first query');

		done();
	});

	pl.DbQueryActions.query(sql1);
	pl.DbQueryActions.query(sql2);
	pl.DbQueryActions.query(sql3);
});

QUnit.test('history items have unique ids', function(assert) {

	var done = assert.async();

	var sql1 = 'I am sql1';
	var sql2 = 'I am sql2';
	var sql3 = 'I am sql3';
	var sql4 = 'I am none of your business';

	var sqlCount = 4;

	var i = 0;
	pl.HistoryStore.addChangeListener(function() {

		if (++i !== sqlCount) { return; }

		var queries = pl.HistoryStore.getQueryHistory();

		var ids = _.pluck(queries, 'id');
		var uniqueIds = _.uniq(ids);

		assert.strictEqual( uniqueIds.length, sqlCount, 'ids must be unique for each query');

		done();
	});

	pl.DbQueryActions.query(sql1);
	pl.DbQueryActions.query(sql2);
	pl.DbQueryActions.query(sql3);
	pl.DbQueryActions.query(sql4);
});