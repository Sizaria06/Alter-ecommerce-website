define([
    'jquery',
    'jquery/ui',
    'jquery/validate',
    'mage/translate'
], function($) {
    'use strict';
    return function() {
        $.validator.addMethod(
            "validate-dob-day",
            function(v, elm, param) {
                var numValue, dataAttrRange, classNameRange, result, range, m, classes, ii;

                if ($.mage.isEmptyNoTrim(v)) {
                    return true;
                }

                numValue = $.mage.parseNumber(v);

                if (isNaN(numValue)) {
                    return false;
                }

                dataAttrRange = /^(-?\d+)?-(-?\d+)?$/;
                classNameRange = /^digits-range-(-?\d+)?-(-?\d+)?$/;
                result = true;
                range = param;

                if (typeof range === 'string') {
                    m = dataAttrRange.exec(range);

                    if (m) {
                        result = result && $.mage.isBetween(numValue, m[1], m[2]);
                    } else {
                        result = false;
                    }
                } else if (elm && elm.className) {
                    classes = elm.className.split(' ');
                    ii = classes.length;

                    while (ii--) {
                        range = classes[ii];
                        m = classNameRange.exec(range);

                        if (m) { //eslint-disable-line max-depth
                            result = result && $.mage.isBetween(numValue, m[1], m[2]);
                            break;
                        }
                    }
                }

                return result;
            },
            $.mage.__('Please enter a valid day (1-31)'),
            true
        );
        $.validator.addMethod(
            "validate-dob-month",
            function(v, elm, param) {
                var numValue, dataAttrRange, classNameRange, result, range, m, classes, ii;

                if ($.mage.isEmptyNoTrim(v)) {
                    return true;
                }

                numValue = $.mage.parseNumber(v);

                if (isNaN(numValue)) {
                    return false;
                }

                dataAttrRange = /^(-?\d+)?-(-?\d+)?$/;
                classNameRange = /^digits-range-(-?\d+)?-(-?\d+)?$/;
                result = true;
                range = param;

                if (typeof range === 'string') {
                    m = dataAttrRange.exec(range);

                    if (m) {
                        result = result && $.mage.isBetween(numValue, m[1], m[2]);
                    } else {
                        result = false;
                    }
                } else if (elm && elm.className) {
                    classes = elm.className.split(' ');
                    ii = classes.length;

                    while (ii--) {
                        range = classes[ii];
                        m = classNameRange.exec(range);

                        if (m) { //eslint-disable-line max-depth
                            result = result && $.mage.isBetween(numValue, m[1], m[2]);
                            break;
                        }
                    }
                }

                return result;
            },
            $.mage.__('Please enter a valid day (1-12)'),
            true
        );
        $.validator.addMethod(
            "validate-dob-year",
            function(v, elm, param) {
                var numValue, dataAttrRange, classNameRange, result, range, m, classes, ii;
                var validator = this;
                var date = new Date;
                var currentYear = date.getFullYear();
                var year = v;

                validator.validateMessage =
                    $.mage.__('Please enter a valid day (1900-%d)').replace('%d', currentYear);
                if ($.mage.isEmptyNoTrim(v)) {
                    return true;
                }

                numValue = $.mage.parseNumber(v);

                if (isNaN(numValue)) {
                    return false;
                }

                return (year >= 1900 && year <= currentYear);
            },
            function() {
                return this.validateMessage;
            },
            true
        );

    }
});