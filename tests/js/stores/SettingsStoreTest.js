QUnit.module('SettingsStoreTest', {

	beforeEach: function(assert) {

		pl.SettingsStore._init();

		pl.Themes._init();
		pl.Themes.load();

		assert.strictEqual(
			pl.SettingsStore.getTheme(),
			pl.Themes.getDefaultTheme(),
			'before each test theme should start as default theme'
		);
	}
});

QUnit.test('set theme notifies observers', function(assert) {

	var theme = pl.Themes.getThemes()[0];

	var done = assert.async();
	pl.SettingsStore.addChangeListener(function() {
		assert.strictEqual(pl.SettingsStore.getTheme(), theme, 'theme is the new theme set');
		done();
	});

	pl.SettingsActions.setTheme(theme);
});

QUnit.test('set invalid theme does nothing', function(assert) {

	var theme = 'not-a-theme';

	var done = assert.async();
	pl.SettingsStore.addChangeListener(function() {
		assert.strictEqual(pl.SettingsStore.getTheme(), pl.Themes.getDefaultTheme(), 'theme is the default theme');
		done();
	});

	pl.SettingsActions.setTheme(theme);
});