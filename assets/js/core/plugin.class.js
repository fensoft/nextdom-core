
/* This file is part of Jeedom.
 *
 * Jeedom is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Jeedom is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Jeedom. If not, see <http://www.gnu.org/licenses/>.
 */


nextdom.plugin = function() {
};

nextdom.plugin.cache = Array();

nextdom.plugin.all = function(_params) {
    var paramsRequired = [];
    var paramsSpecifics = {
        pre_success: function(data) {
            nextdom.plugin.cache.all = data.result;
            return data;
        }
    };
    try {
        nextdom.private.checkParamsRequired(_params || {}, paramsRequired);
    } catch (e) {
        (_params.error || paramsSpecifics.error || nextdom.private.default_params.error)(e);
        return;
    }
    if (isset(nextdom.plugin.cache.all) && 'function' == typeof (_params.success)) {
        _params.success(nextdom.plugin.cache.all);
        return;
    }
    var params = $.extend({}, nextdom.private.default_params, paramsSpecifics, _params || {});
    var paramsAJAX = nextdom.private.getParamsAJAX(params, 'Plugin', 'all');
    $.ajax(paramsAJAX);
};

nextdom.plugin.toggle = function(_params) {
    var paramsRequired = ['id', 'state'];
    var paramsSpecifics = {};
    try {
        nextdom.private.checkParamsRequired(_params || {}, paramsRequired);
    } catch (e) {
        (_params.error || paramsSpecifics.error || nextdom.private.default_params.error)(e);
        return;
    }
    var params = $.extend({}, nextdom.private.default_params, paramsSpecifics, _params || {});
    var paramsAJAX = nextdom.private.getParamsAJAX(params, 'Plugin', 'toggle');
    paramsAJAX.data['id'] = _params.id;
    paramsAJAX.data['state'] = _params.state;
    $.ajax(paramsAJAX);
};

nextdom.plugin.get = function(_params) {
    var paramsRequired = ['id'];
    var paramsSpecifics = {};
    try {
        nextdom.private.checkParamsRequired(_params || {}, paramsRequired);
    } catch (e) {
        (_params.error || paramsSpecifics.error || nextdom.private.default_params.error)(e);
        return;
    }
    var params = $.extend({}, nextdom.private.default_params, paramsSpecifics, _params || {});
    var paramsAJAX = nextdom.private.getParamsAJAX(params, 'Plugin', 'getConf');
    paramsAJAX.data['id'] = _params.id;
    $.ajax(paramsAJAX);
};

nextdom.plugin.getDependancyInfo = function(_params) {
    var paramsRequired = ['id'];
    var paramsSpecifics = {
        global: false,
    };
    try {
        nextdom.private.checkParamsRequired(_params || {}, paramsRequired);
    } catch (e) {
        (_params.error || paramsSpecifics.error || nextdom.private.default_params.error)(e);
        return;
    }
    var params = $.extend({}, nextdom.private.default_params, paramsSpecifics, _params || {});
    var paramsAJAX = nextdom.private.getParamsAJAX(params, 'Plugin', 'getDependancyInfo');
    paramsAJAX.data['id'] = _params.id;
    $.ajax(paramsAJAX);
};

nextdom.plugin.dependancyInstall = function(_params) {
    var paramsRequired = ['id'];
    var paramsSpecifics = {};
    try {
        nextdom.private.checkParamsRequired(_params || {}, paramsRequired);
    } catch (e) {
        (_params.error || paramsSpecifics.error || nextdom.private.default_params.error)(e);
        return;
    }
    var params = $.extend({}, nextdom.private.default_params, paramsSpecifics, _params || {});
    var paramsAJAX = nextdom.private.getParamsAJAX(params, 'Plugin', 'dependancyInstall');
    paramsAJAX.data['id'] = _params.id;
    $.ajax(paramsAJAX);
};

nextdom.plugin.getDeamonInfo = function(_params) {
    var paramsRequired = ['id'];
    var paramsSpecifics = {
        global: false,
    };
    try {
        nextdom.private.checkParamsRequired(_params || {}, paramsRequired);
    } catch (e) {
        (_params.error || paramsSpecifics.error || nextdom.private.default_params.error)(e);
        return;
    }
    var params = $.extend({}, nextdom.private.default_params, paramsSpecifics, _params || {});
    var paramsAJAX = nextdom.private.getParamsAJAX(params, 'Plugin', 'getDeamonInfo');
    paramsAJAX.data['id'] = _params.id;
    $.ajax(paramsAJAX);
};

nextdom.plugin.deamonStart = function(_params) {
    var paramsRequired = ['id'];
    var paramsSpecifics = {};
    try {
        nextdom.private.checkParamsRequired(_params || {}, paramsRequired);
    } catch (e) {
        (_params.error || paramsSpecifics.error || nextdom.private.default_params.error)(e);
        return;
    }
    var params = $.extend({}, nextdom.private.default_params, paramsSpecifics, _params || {});
    var paramsAJAX = nextdom.private.getParamsAJAX(params, 'Plugin', 'deamonStart');
    paramsAJAX.data['id'] = _params.id;
    paramsAJAX.data['debug'] = _params.debug || 0;
    paramsAJAX.data['forceRestart'] = _params.forceRestart || 0;
    $.ajax(paramsAJAX);
};

nextdom.plugin.deamonStop = function(_params) {
    var paramsRequired = ['id'];
    var paramsSpecifics = {};
    try {
        nextdom.private.checkParamsRequired(_params || {}, paramsRequired);
    } catch (e) {
        (_params.error || paramsSpecifics.error || nextdom.private.default_params.error)(e);
        return;
    }
    var params = $.extend({}, nextdom.private.default_params, paramsSpecifics, _params || {});
    var paramsAJAX = nextdom.private.getParamsAJAX(params, 'Plugin', 'deamonStop');
    paramsAJAX.data['id'] = _params.id;
    $.ajax(paramsAJAX);
};

nextdom.plugin.deamonChangeAutoMode = function(_params) {
    var paramsRequired = ['id','mode'];
    var paramsSpecifics = {};
    try {
        nextdom.private.checkParamsRequired(_params || {}, paramsRequired);
    } catch (e) {
        (_params.error || paramsSpecifics.error || nextdom.private.default_params.error)(e);
        return;
    }
    var params = $.extend({}, nextdom.private.default_params, paramsSpecifics, _params || {});
    var paramsAJAX = nextdom.private.getParamsAJAX(params, 'Plugin', 'deamonChangeAutoMode');
    paramsAJAX.data['id'] = _params.id;
    paramsAJAX.data['mode'] = _params.mode;
    $.ajax(paramsAJAX);
};