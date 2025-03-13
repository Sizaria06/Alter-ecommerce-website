define([
    'jquery',
    'intlTelInputs'
], function($) {
    var initIntl = function(config, node) {
        $(node).intlTelInputs(config);
    };
    return initIntl;
});