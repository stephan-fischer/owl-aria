"use strict";

/**
 * Aria Plugin
 * Author: Stephan Fischer
 * @since 2.0.0
 */
;(function ($, window, document, undefined)
{
    let Aria = function(scope)
    {
        this._core     = scope;
        this.options   = $.extend({}, Aria.Defaults, this._core.options);

        if (!this.options.aria) {
            return false;
        }

        this.setup();
        this.$element.on(
        {
            'initialized.owl.carousel': e =>
            {
				if (e.namespace && !this._init) {
                    this.$stage = this._core.$stage;
                    this.$nav  = $('.' + 
                        this.options.navContainerClass + ', .' + 
                        this.options.dotsClass, this.$element);

                    this.$nav.children()
                        .attr("role", "button")
                        .attr("tabindex", "0")
                        .storeTabindex();

                    this.bind();
                    this.setAria();
                    this._init = true;
				}
            },
            'changed.owl.carousel':    e => this.setAria()
            //'translated.owl.carousel': e => this.setAria(),
            //'refreshed.owl.carousel':  e => this.setAria(),
            //'resized.owl.carousel':    e => this.setAria()
		});
    }

    Aria.Defaults = 
    {
        aria: true
    };

    Aria.prototype.setup = function()
    {
        this._init     = false;
        this.$element  = this._core.$element;
        this.$element.attr('tabindex', '0').storeTabindex();
        this.$element.find('*').storeTabindex();
    };

    Aria.prototype.bind = function()
    {
        
        this.$element.on('to.owl.carousel',      (e) => e.stopPropagation());
        this.$element.on('next.owl.carousel',    (e) => e.stopPropagation());
        this.$element.on('prev.owl.carousel',    (e) => e.stopPropagation());
        this.$element.on('destroy.owl.carousel', (e) => e.stopPropagation());
        this.$element
        .on('focusin',  (e) => this.focus(e))
        .on('focusout', (e) => this.blur(e))
        .on('keyup',    (e) => this.keyUp(e));
    };

    Aria.prototype.focus = function() 
    {
        this.$element.attr({'aria-live': 'polite'});
    };

    Aria.prototype.blur = function() 
    {
        this.$element.attr({'aria-live': 'off'});
    };

    Aria.prototype.keyUp = function(e) 
    {
        let action = null;

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

    Aria.prototype.setAria = function() 
    {
        if (!this.$stage || !this.$stage.length)  {
            return false;
        }

        setTimeout(() => 
        {
            this.$nav.children().each((i, el) => 
            {
                const $item = $(el);
                const isDisabled = $item.hasClass('disabled');
                const isActive = $item.hasClass('active');

                $item.attr('aria-disabled', isDisabled || isActive ? "true": "false");

            });

            this.$stage.children().each((i, el) => 
            {
                const $item = $(el);
                const isActive = $item.hasClass('active');

                $item.attr('aria-hidden', !isActive ? "true": "false");
                $item.find('*').each((i, e) =>
                {
                    const $el = $(e);
                    
                    if (isActive === false) {
            
                        $el.storeTabindex();
                        $el.attr("tabindex", "-1");
                        
                    } else {
                        $el.restoreTabindex();
                    }
                });
            });
        });
    }

    Aria.prototype.destroy = function()
    {
        this.$element.removeAttr('aria-live');
        this.$element.removeAttr('tabindex');
        this.$element.children().removeAttr('aria-hidden');
        this.$element.find('[data-tabindex]').restoreTabindex();
        this.$element
        .off('focusin',  (e) => this.focus(e))
        .off('focusout', (e) => this.blur(e))
        .off('keyup',    (e) => this.keyUp(e));
    };

    $.fn.extend({
        restoreTabindex: function()
        {
            return this.each(function() 
            {
                const $el = $(this);

                if (!$el.is('[data-tabindex]')) {
                    $el.removeAttr("tabindex");
                } else {
                    $el.attr("tabindex", $el.attr('data-tabindex'));
                }
            });
        },
        storeTabindex: function() {
            return this.each(function()
            {
                const $el = $(this);
                
                if ($el.is('[tabindex]') && !$el.is('[data-tabindex]')) {
                    $el.attr("data-tabindex", $el.attr('tabindex'));
                }
            });
        }
    });

    $.fn.owlCarousel.Constructor.Plugins['Aria'] = Aria;
})( window.Zepto || window.jQuery, window,  document );