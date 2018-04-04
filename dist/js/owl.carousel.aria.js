"use strict";

/**
 * Aria Plugin
 * Author: Stephan Fischer
 * @since 2.0.0
 */

;(function ($, window, document, undefined) {
    var Aria = function Aria(scope) {
        var _this = this;

        this._core = scope;
        this.options = $.extend({}, Aria.Defaults, this._core.options);

        if (!this.options.aria) {
            return false;
        }

        this.setup();
        this.$element.on({
            'initialized.owl.carousel': function initializedOwlCarousel(e) {
                if (e.namespace && !_this._init) {
                    _this.$stage = _this._core.$stage;
                    _this.$nav = $('.' + _this.options.navContainerClass + ', .' + _this.options.dotsClass, _this.$element);

                    _this.$nav.children().attr("role", "button").attr("tabindex", "0").storeTabindex();

                    _this.bind();
                    _this.setAria();
                    _this._init = true;
                }
            },
            'changed.owl.carousel': function changedOwlCarousel(e) {
                return _this.setAria();
            }
            //'translated.owl.carousel': e => this.setAria(),
            //'refreshed.owl.carousel':  e => this.setAria(),
            //'resized.owl.carousel':    e => this.setAria()
        });
    };

    Aria.Defaults = {
        aria: true
    };

    Aria.prototype.setup = function () {
        this._init = false;
        this.$element = this._core.$element;
        this.$element.attr('tabindex', '0').storeTabindex();
        this.$element.find('*').storeTabindex();
    };

    Aria.prototype.bind = function () {
        var _this2 = this;

        this.$element.on('to.owl.carousel', function (e) {
            return e.stopPropagation();
        });
        this.$element.on('next.owl.carousel', function (e) {
            return e.stopPropagation();
        });
        this.$element.on('prev.owl.carousel', function (e) {
            return e.stopPropagation();
        });
        this.$element.on('destroy.owl.carousel', function (e) {
            return e.stopPropagation();
        });
        this.$element.on('focusin', function (e) {
            return _this2.focus(e);
        }).on('focusout', function (e) {
            return _this2.blur(e);
        }).on('keyup', function (e) {
            return _this2.keyUp(e);
        });
    };

    Aria.prototype.focus = function () {
        this.$element.attr({ 'aria-live': 'polite' });
    };

    Aria.prototype.blur = function () {
        this.$element.attr({ 'aria-live': 'off' });
    };

    Aria.prototype.keyUp = function (e) {
        var action = null;

        if (e.keyCode == 37 || e.keyCode == 38) {
            action = 'prev.owl.carousel';
        } else if (e.keyCode == 39 || e.keyCode == 40) {
            action = 'next.owl.carousel';
        }

        if (action !== null) {
            this.$element.trigger(action);
        }

        return false; // important!
    };

    Aria.prototype.setAria = function () {
        var _this3 = this;

        if (!this.$stage || !this.$stage.length) {
            return false;
        }

        setTimeout(function () {
            _this3.$nav.children().each(function (i, el) {
                var $item = $(el);
                var isDisabled = $item.hasClass('disabled');
                var isActive = $item.hasClass('active');

                $item.attr('aria-disabled', isDisabled || isActive ? "true" : "false");
            });

            _this3.$stage.children().each(function (i, el) {
                var $item = $(el);
                var isActive = $item.hasClass('active');

                $item.attr('aria-hidden', !isActive ? "true" : "false");
                $item.find('*').each(function (i, e) {
                    var $el = $(e);

                    if (isActive === false) {

                        $el.storeTabindex();
                        $el.attr("tabindex", "-1");
                    } else {
                        $el.restoreTabindex();
                    }
                });
            });
        });
    };

    Aria.prototype.destroy = function () {
        var _this4 = this;

        this.$element.removeAttr('aria-live');
        this.$element.removeAttr('tabindex');
        this.$element.children().removeAttr('aria-hidden');
        this.$element.find('[data-tabindex]').restoreTabindex();
        this.$element.off('focusin', function (e) {
            return _this4.focus(e);
        }).off('focusout', function (e) {
            return _this4.blur(e);
        }).off('keyup', function (e) {
            return _this4.keyUp(e);
        });
    };

    $.fn.extend({
        restoreTabindex: function restoreTabindex() {
            return this.each(function () {
                var $el = $(this);

                if (!$el.is('[data-tabindex]')) {
                    $el.removeAttr("tabindex");
                } else {
                    $el.attr("tabindex", $el.attr('data-tabindex'));
                }
            });
        },
        storeTabindex: function storeTabindex() {
            return this.each(function () {
                var $el = $(this);

                if ($el.is('[tabindex]') && !$el.is('[data-tabindex]')) {
                    $el.attr("data-tabindex", $el.attr('tabindex'));
                }
            });
        }
    });

    $.fn.owlCarousel.Constructor.Plugins['Aria'] = Aria;
})(window.Zepto || window.jQuery, window, document);