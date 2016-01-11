function keyCodes() {
    this.tab        = 9;
    this.enter      = 13;
    this.esc        = 27;

    this.space      = 32;
    this.pageup     = 33;
    this.pagedown   = 34;
    this.end        = 35;
    this.home       = 36;

    this.left       = 37;
    this.up         = 38;
    this.right      = 39;
    this.down       = 40;
}

function tabpanel(id, accordian) {
    this.panel_id  = id;
    this.accordian = accordian;
    this.$panel    = $('#' + id);
    this.keys      = new keyCodes();
    this.$tabs     = this.$panel.find('.tab');
    this.$panels   = this.$panel.children('.panel');

    this.bindHandlers();
    this.init();
}

tabpanel.prototype.init = function() {
    var $tab;

    this.$panels.attr('aria-hidden', 'true');

    this.$panels.hide();
    $tab = this.$tabs.filter('.selected');

    if ($tab == undefined) {
        $tab = this.$tabs.first();
        $tab.addClass('selected');
    }

    this.$panel.find('#' + $tab.attr('aria-controls')).show().attr('aria-hidden', 'false');
}

tabpanel.prototype.switchTabs = function($curTab, $newTab) {
    $curTab.removeClass('selected focus');
    $curTab.attr('tabindex', '-1').attr('aria-selected', 'false');

    $newTab.addClass('selected').attr('aria-selected', 'true');

    if (this.accordian == false) {
        this.$panel.find('#' + $curTab.attr('aria-controls')).hide().attr('aria-hidden', 'true');
        $curTab.attr('aria-expanded', 'false');
        this.$panel.find('#' + $newTab.attr('aria-controls')).show().attr('aria-hidden', 'false');
        $newTab.attr('aria-expanded', 'true');

        this.$focusable.length = 0;
        this.$panels.find(':focusable');
    }

    $newTab.attr('tabindex', '0');
    $newTab.focus();
}

tabpanel.prototype.togglePanel = function($tab) {
    $panel = this.$panel.find('#' + $tab.attr('aria-controls'));

    if ($panel.attr('aria-hidden') == 'true') {
        $panel.attr('aria-hidden', 'false');
        $panel.slideDown(100);
        $tab.find('img').attr('src', 'http://www.oaa-accessibility.org/media/examples/images/expanded.gif').attr('alt', 'expanded');
        $tab.attr('aria-expanded', 'true');
    }
    else {
        $panel.attr('aria-hidden', 'true');
        $panel.slideUp(100);
        $tab.find('img').attr('src', 'http://www.oaa-accessibility.org/media/examples/images/contracted.gif').attr('alt', 'collapsed');
        $tab.attr('aria-expanded', 'false');
    }
}

tabpanel.prototype.bindHandlers = function() {
    var thisObj = this;
    this.$tabs.keydown(function(e) {
        return thisObj.handleTabKeyDown($(this), e);
    });

    this.$tabs.keypress(function(e) {
        return thisObj.handleTabKeyPress($(this), e);
    });

    this.$tabs.click(function(e) {
        return thisObj.handleTabClick($(this), e);
    });

    this.$tabs.focus(function(e) {
        return thisObj.handleTabFocus($(this), e);
    });

    this.$tabs.blur(function(e) {
        return thisObj.handleTabBlur($(this), e);
    });

    this.$panels.keydown(function(e) {
        return thisObj.handlePanelKeyDown($(this), e);
    });

    this.$panels.keypress(function(e) {
        return thisObj.handlePanelKeyPress($(this), e);
    });

    this.$panels.click(function(e) {
        return thisObj.handlePanelClick($(this), e);
    });
}

tabpanel.prototype.handleTabKeyDown = function($tab, e) {
    if (e.altKey) {
        return true;
    }

    switch (e.keyCode) {
        case this.keys.enter:
        case this.keys.space: {
            if (this.accordian == true) {
                this.togglePanel($tab);

                e.stopPropagation();
                return false;
            }

            return true;
        }
        case this.keys.left:
        case this.keys.up: {
            var thisObj = this;
            var $prevTab;
            var $newTab;

            if (e.ctrlKey) {
            }
            else {
                var curNdx = this.$tabs.index($tab);

                if (curNdx == 0) {
                    $newTab = this.$tabs.last();
                }
                else {
                    $newTab = this.$tabs.eq(curNdx - 1);
                }

                this.switchTabs($tab, $newTab);
            }

            e.stopPropagation();
            return false;
        }
        case this.keys.right:
        case this.keys.down: {
            var thisObj = this;
            var foundTab = false;
            var $newTab;

            var curNdx = this.$tabs.index($tab);

            if (curNdx == this.$tabs.length-1) {
                $newTab = this.$tabs.first();
            }
            else {
                $newTab = this.$tabs.eq(curNdx + 1);
            }

            this.switchTabs($tab, $newTab);

            e.stopPropagation();
            return false;
        }
        case this.keys.home: {
            this.switchTabs($tab, this.$tabs.first());

            e.stopPropagation();
            return false;
        }
        case this.keys.end: {
            this.switchTabs($tab, this.$tabs.last());

            e.stopPropagation();
            return false;
        }
    }
}

tabpanel.prototype.handleTabKeyPress = function($tab, e) {
    if (e.altKey) {
        return true;
    }

    switch (e.keyCode) {
        case this.keys.enter:
        case this.keys.space:
        case this.keys.left:
        case this.keys.up:
        case this.keys.right:
        case this.keys.down:
        case this.keys.home:
        case this.keys.end: {
            e.stopPropagation();
            return false;
        }
        case this.keys.pageup:
        case this.keys.pagedown: {
            if (!e.ctrlKey) {
                return true;
            }

            e.stopPropagation();
            return false;
        }
    }
    return true;
}

tabpanel.prototype.handleTabClick = function($tab, e) {
    $tab.attr('tabindex', '0').attr('aria-selected', 'true').addClass('selected');
    this.$tabs.not($tab).attr('tabindex', '-1').attr('aria-selected', 'false').removeClass('selected');

    this.togglePanel($tab);

    e.stopPropagation();
    return false;
}

tabpanel.prototype.handleTabFocus = function($tab, e) {
    $tab.addClass('focus');
    return true;
}

tabpanel.prototype.handleTabBlur = function($tab, e) {
    $tab.removeClass('focus');
    return true;
}

tabpanel.prototype.handlePanelKeyDown = function($panel, e) {
    if (e.altKey) {
        return true;
    }

    switch (e.keyCode) {
        case this.keys.tab: {
            var $focusable = $panel.find(':focusable');
            var curNdx     = $focusable.index($(e.target));
            var panelNdx   = this.$panels.index($panel);
            var numPanels  = this.$panels.length

            if (e.shiftKey) {
                if (curNdx == 0 && panelNdx > 0) {
                    for (var ndx = panelNdx - 1; ndx >= 0; ndx--) {
                        var $prevPanel = this.$panels.eq(ndx);
                        var $prevTab = $('#' + $prevPanel.attr('aria-labelledby'));

                        $focusable.length = 0;
                        $focusable = $prevPanel.find(':focusable');

                        if ($focusable.length > 0) {
                            $focusable.last().focus();
                            this.$tabs.attr('aria-selected', 'false').removeClass('selected');
                            $prevTab.attr('aria-selected', 'true').addClass('selected');

                            e.stopPropagation;
                            return false;
                        }
                    }
                }
            }
            else if (panelNdx < numPanels) {
                if (curNdx == $focusable.length - 1) {
                    for (var ndx = panelNdx + 1; ndx < numPanels; ndx++) {

                        var $nextPanel = this.$panels.eq(ndx);
                        var $nextTab = $('#' + $nextPanel.attr('aria-labelledby'));
                        $focusable.length = 0;
                        $focusable = $nextPanel.find(':focusable');

                        if ($focusable.length > 0) {
                            $focusable.first().focus();
                            this.$tabs.attr('aria-selected', 'false').removeClass('selected');
                            $nextTab.attr('aria-selected', 'true').addClass('selected');

                            e.stopPropagation;
                            return false;
                        }
                    }
                }
            }
            break;
        }
        case this.keys.left:
        case this.keys.up: {
            if (!e.ctrlKey) {
                return true;
            }

            var $tab = $('#' + $panel.attr('aria-labelledby'));
            $tab.focus();

            e.stopPropagation();
            return false;
       }
       case this.keys.pageup: {
           var $newTab;
           if (!e.ctrlKey) {
               return true;
           }

           var $tab = this.$tabs.filter('.selected');
           var curNdx = this.$tabs.index($tab);

           if (curNdx == 0) {
               $newTab = this.$tabs.last();
           }
           else {
               $newTab = this.$tabs.eq(curNdx - 1);
           }

           this.switchTabs($tab, $newTab);

           e.stopPropagation();
           e.preventDefault();
           return false;
       }
       case this.keys.pagedown: {
           var $newTab;

           if (!e.ctrlKey) {
               return true;
           }

           var $tab = $('#' + $panel.attr('aria-labelledby'));
           var curNdx = this.$tabs.index($tab);

           if (curNdx == this.$tabs.length-1) {
               $newTab = this.$tabs.first();
           }
           else {
               $newTab = this.$tabs.eq(curNdx + 1);
           }

           this.switchTabs($tab, $newTab);

           e.stopPropagation();
           e.preventDefault();
           return false;
       }
    }

    return true;
}

tabpanel.prototype.handlePanelKeyPress = function($panel, e) {
    if (e.altKey) {
        return true;
    }

    if (e.ctrlKey && (e.keyCode == this.keys.pageup || e.keyCode == this.keys.pagedown)) {
        e.stopPropagation();
        e.preventDefault();
        return false;
    }

    switch (e.keyCode) {
        case this.keys.esc: {
            e.stopPropagation();
            e.preventDefault();
            return false;
        }
    }

    return true;
}

tabpanel.prototype.handlePanelClick = function($panel, e) {

    var $tab = $('#' + $panel.attr('aria-labelledby'));
    $tab.attr('tabindex', '0').attr('aria-selected', 'true').addClass('selected');

    this.$tabs.not($tab).attr('tabindex', '-1').attr('aria-selected', 'false').removeClass('selected');

    return true;
}

