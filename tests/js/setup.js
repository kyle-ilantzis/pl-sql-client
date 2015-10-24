QUnit.config.reorder = false;

(function(window) {

    window.plt = {

        once: function(n, f) {

            var i = 0;

            var g = function() {
                i++;
                if ( i === n ) {
                    f.apply(this, arguments);
                }
            };

            return g;
        }
    };
})(window);