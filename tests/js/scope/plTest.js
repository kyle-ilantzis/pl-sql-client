QUnit.module('plTest');

QUnit.test('all for empty array is true', function(assert) {
	assert.ok( pl.all([], function(){ return true; }) );
});

QUnit.test('all for always true predicate is true', function(assert) {
	assert.ok( pl.all(['a', 'b', 'c'], function(){ return true; }) );
});

QUnit.test('all for always false predicate is false', function(assert) {
	assert.notOk( pl.all(['a', 'b', 'c'], function(){ return false; }) );
});

QUnit.test('all for not always true predicate is false', function(assert) {
	assert.notOk( pl.all(['a', 'b', 'c'], function(x){ return x !== 'b'; }) );
});