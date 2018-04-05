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
                    this.navigation();
                    this.bind();
                    this.setAria();
                    this._init = true;
				}
            },
            'changed.owl.carousel':    e => this.setAria()
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

    Aria.prototype.navigation = function()
    {
        this.$nav  = $('.' + 
        this.options.navContainerClass + ', .' + 
        this.options.dotsClass, this.$element);
        const noButtonSel = ":not(button):not(input[type='submit'])";

        this.setNavAria();

        this.$nav.children()
        .attr("role", "button")
        .storeTabindex().filter(noButtonSel).each((i, e) => 
        {
            const $el = $(e);

            $el.on('keydown', e => 
            {
                if (e.keyCode === 32 || e.keyCode === 13) {
                    $el.trigger('click');
                    return false;
                }
            });
        });
    }

    Aria.prototype.bind = function()
    {
        
        this.$element.on('to.owl.carousel',      (e) => e.stopPropagation());
        this.$element.on('next.owl.carousel',    (e) => e.stopPropagation());
        this.$element.on('prev.owl.carousel',    (e) => e.stopPropagation());
        this.$element.on('destroy.owl.carousel', (e) => e.stopPropagation());
        this.$element
        .on('focusin',  (e) => this.focus(e))
        .on('focusout', (e) => this.blur(e))
        .on('keydown',  (e) => this.keydown(e));
    };

    Aria.prototype.focus = function() 
    {
        this.$element.attr({'aria-live': 'polite'});
    };

    Aria.prototype.blur = function() 
    {
        this.$element.attr({'aria-live': 'off'});
    };

    Aria.prototype.keydown = function(e) 
    {
        let action = null;

        if (e.keyCode == 37 || e.keyCode == 38) {
            action = 'prev.owl.carousel';
        } else if (e.keyCode == 39 || e.keyCode == 40) {
            action = 'next.owl.carousel';
        }

        if (action !== null) {
            this.$element.trigger(action);
            return false; 
        }
    };

    Aria.prototype.setNavAria = function()
    {
        this.$nav.children().each((i, el) => 
        {
            const $el = $(el);
            const isDisabled = $el.hasClass('disabled') || $el.hasClass('active');

            $el.attr('aria-disabled', isDisabled  ? "true": "false");
            
            if (isDisabled) {
                $el.attr("tabindex", "-1");
                $el.attr("data-tabindex", $el.attr('tabindex'));
            } else {
                
                $el.attr("tabindex", "0");
                $el.attr("data-tabindex", $el.attr('tabindex'));
            }

        });
    };

    Aria.prototype.setAria = function() 
    {
        if (!this.$stage || !this.$stage.length)  {
            return false;
        }

        this.setNavAria();
        
        setTimeout(() => 
        {


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
        .off('keydown',  (e) => this.keydown(e));
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