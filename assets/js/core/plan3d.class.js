
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


 nextdom.plan3d = function () {
 };

 nextdom.plan3d.cache = Array();

 nextdom.plan3d.remove = function (_params) {
    var paramsRequired = [];
    var paramsSpecifics = {};
    try {
        nextdom.private.checkParamsRequired(_params || {}, paramsRequired);
    } catch (e) {
        (_params.error || paramsSpecifics.error || nextdom.private.default_params.error)(e);
        return;
    }
    var params = $.extend({}, nextdom.private.default_params, paramsSpecifics, _params || {});
    var paramsAJAX = nextdom.private.getParamsAJAX(params, 'Plan3d', 'remove');
    paramsAJAX.data['id'] = _params.id || '';
    paramsAJAX.data['link_type'] = _params.link_type || '';
    paramsAJAX.data['link_id'] = _params.link_id || '';
    paramsAJAX.data['plan3dHeader_id'] = _params.plan3dHeader_id || '';
    $.ajax(paramsAJAX);
};

nextdom.plan3d.save = function (_params) {
    var paramsRequired = ['plan3ds'];
    var paramsSpecifics = {
        global: _params.global || true,
    };
    try {
        nextdom.private.checkParamsRequired(_params || {}, paramsRequired);
    } catch (e) {
        (_params.error || paramsSpecifics.error || nextdom.private.default_params.error)(e);
        return;
    }
    var params = $.extend({}, nextdom.private.default_params, paramsSpecifics, _params || {});

    var paramsAJAX = nextdom.private.getParamsAJAX(params, 'Plan3d', 'save');
    paramsAJAX.data['plan3ds'] = json_encode(_params.plan3ds);
    $.ajax(paramsAJAX);
};

nextdom.plan3d.byId = function (_params) {
    var paramsRequired = ['id'];
    var paramsSpecifics = {};
    try {
        nextdom.private.checkParamsRequired(_params || {}, paramsRequired);
    } catch (e) {
        (_params.error || paramsSpecifics.error || nextdom.private.default_params.error)(e);
        return;
    }
    var params = $.extend({}, nextdom.private.default_params, paramsSpecifics, _params || {});
    var paramsAJAX = nextdom.private.getParamsAJAX(params, 'Plan3d', 'get');
    paramsAJAX.data['id'] = _params.id;
    $.ajax(paramsAJAX);
};

nextdom.plan3d.byName = function (_params) {
    var paramsRequired = ['name','plan3dHeader_id'];
    var paramsSpecifics = {};
    try {
        nextdom.private.checkParamsRequired(_params || {}, paramsRequired);
    } catch (e) {
        (_params.error || paramsSpecifics.error || nextdom.private.default_params.error)(e);
        return;
    }
    var params = $.extend({}, nextdom.private.default_params, paramsSpecifics, _params || {});
    var paramsAJAX = nextdom.private.getParamsAJAX(params, 'Plan3d', 'byName');
    paramsAJAX.data['name'] = _params.name;
    paramsAJAX.data['plan3dHeader_id'] = _params.plan3dHeader_id;
    $.ajax(paramsAJAX);
};


nextdom.plan3d.byplan3dHeader = function (_params) {
    var paramsRequired = ['plan3dHeader_id'];
    var paramsSpecifics = {};
    try {
        nextdom.private.checkParamsRequired(_params || {}, paramsRequired);
    } catch (e) {
        (_params.error || paramsSpecifics.error || nextdom.private.default_params.error)(e);
        return;
    }
    var params = $.extend({}, nextdom.private.default_params, paramsSpecifics, _params || {});
    var paramsAJAX = nextdom.private.getParamsAJAX(params, 'Plan3d', 'plan3dHeader');
    paramsAJAX.data['plan3dHeader_id'] = _params.plan3dHeader_id;
    $.ajax(paramsAJAX);
};

nextdom.plan3d.saveHeader = function (_params) {
    var paramsRequired = ['plan3dHeader'];
    var paramsSpecifics = {};
    try {
        nextdom.private.checkParamsRequired(_params || {}, paramsRequired);
    } catch (e) {
        (_params.error || paramsSpecifics.error || nextdom.private.default_params.error)(e);
        return;
    }
    var params = $.extend({}, nextdom.private.default_params, paramsSpecifics, _params || {});
    var paramsAJAX = nextdom.private.getParamsAJAX(params, 'Plan3d', 'saveplan3dHeader');
    paramsAJAX.data['plan3dHeader'] = json_encode(_params.plan3dHeader);
    $.ajax(paramsAJAX);
};

nextdom.plan3d.removeHeader = function (_params) {
    var paramsRequired = ['id'];
    var paramsSpecifics = {};
    try {
        nextdom.private.checkParamsRequired(_params || {}, paramsRequired);
    } catch (e) {
        (_params.error || paramsSpecifics.error || nextdom.private.default_params.error)(e);
        return;
    }
    var params = $.extend({}, nextdom.private.default_params, paramsSpecifics, _params || {});
    var paramsAJAX = nextdom.private.getParamsAJAX(params, 'Plan3d', 'removeplan3dHeader');
    paramsAJAX.data['id'] = _params.id;
    $.ajax(paramsAJAX);
};

nextdom.plan3d.getHeader = function (_params) {
    var paramsRequired = ['id'];
    var paramsSpecifics = {};
    try {
        nextdom.private.checkParamsRequired(_params || {}, paramsRequired);
    } catch (e) {
        (_params.error || paramsSpecifics.error || nextdom.private.default_params.error)(e);
        return;
    }
    var params = $.extend({}, nextdom.private.default_params, paramsSpecifics, _params || {});
    var paramsAJAX = nextdom.private.getParamsAJAX(params, 'Plan3d', 'getplan3dHeader');
    paramsAJAX.data['id'] = _params.id;
    paramsAJAX.data['code'] = _params.code;
    $.ajax(paramsAJAX);
};

nextdom.plan3d.allHeader = function (_params) {
    var paramsRequired = [];
    var paramsSpecifics = {
        pre_success: function(data) {
            nextdom.plan3d.cache.all = data.result;
            return data;
        }
    };
    try {
        nextdom.private.checkParamsRequired(_params || {}, paramsRequired);
    } catch (e) {
        (_params.error || paramsSpecifics.error || nextdom.private.default_params.error)(e);
        return;
    }
    var params = $.extend({}, nextdom.private.default_params, paramsSpecifics, _params || {});
    if (isset(nextdom.plan3d.cache.all)) {
        params.success(nextdom.plan3d.cache.all);
        return;
    }
    var paramsAJAX = nextdom.private.getParamsAJAX(params, 'Plan3d', 'allHeader');
    $.ajax(paramsAJAX);
};
