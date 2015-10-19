QUnit.module('SettingsStoreTest', {

	beforeEach: function() {

		pl.SettingsStore._init();

		pl.Themes._init();
		pl.Themes.load();
	}
});

QUnit.test('set theme notifies observers', function(assert) {

	var done = assert.async();

	var theme = pl.Themes.getThemes()[0];

	assert.strictEqual(pl.SettingsStore.getTheme(), pl.Themes.getDefaultTheme());

	pl.SettingsStore.addChangeListener(function() {
		assert.strictEqual(pl.SettingsStore.getTheme(), theme);
		done();
	});

	pl.SettingsActions.setTheme(theme);
});

QUnit.test('set invalid theme does nothing', function(assert) {

	var done = assert.async();

	var theme = 'not-a-theme';

	assert.strictEqual(pl.SettingsStore.getTheme(), pl.Themes.getDefaultTheme());

	pl.SettingsStore.addChangeListener(function() {
		assert.strictEqual(pl.SettingsStore.getTheme(), pl.Themes.getDefaultTheme());
		done();
	});

	pl.SettingsActions.setTheme(theme);
});