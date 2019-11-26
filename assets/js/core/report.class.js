
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


 nextdom.report = function () {
 };


 nextdom.report.list = function (_params) {
    var paramsRequired = ['type','id'];
    var paramsSpecifics = {};
    try {
        nextdom.private.checkParamsRequired(_params || {}, paramsRequired);
    } catch (e) {
        (_params.error || paramsSpecifics.error || nextdom.private.default_params.error)(e);
        return;
    }
    var params = $.extend({}, nextdom.private.default_params, paramsSpecifics, _params || {});
    var paramsAJAX = nextdom.private.getParamsAJAX(params, 'Report', 'list');
    paramsAJAX.data['id'] = _params.id;
    paramsAJAX.data['type'] = _params.type;
    $.ajax(paramsAJAX);
}

nextdom.report.get = function (_params) {
    var paramsRequired = ['type','id','report'];
    var paramsSpecifics = {};
    try {
        nextdom.private.checkParamsRequired(_params || {}, paramsRequired);
    } catch (e) {
        (_params.error || paramsSpecifics.error || nextdom.private.default_params.error)(e);
        return;
    }
    var params = $.extend({}, nextdom.private.default_params, paramsSpecifics, _params || {});
    var paramsAJAX = nextdom.private.getParamsAJAX(params, 'Report', 'get');
    paramsAJAX.data['id'] = _params.id;
    paramsAJAX.data['type'] = _params.type;
    paramsAJAX.data['report'] = _params.report;
    $.ajax(paramsAJAX);
}

nextdom.report.remove = function (_params) {
    var paramsRequired = ['type','id','report'];
    var paramsSpecifics = {};
    try {
        nextdom.private.checkParamsRequired(_params || {}, paramsRequired);
    } catch (e) {
        (_params.error || paramsSpecifics.error || nextdom.private.default_params.error)(e);
        return;
    }
    var params = $.extend({}, nextdom.private.default_params, paramsSpecifics, _params || {});
    var paramsAJAX = nextdom.private.getParamsAJAX(params, 'Report', 'remove');
    paramsAJAX.data['id'] = _params.id;
    paramsAJAX.data['type'] = _params.type;
    paramsAJAX.data['report'] = _params.report;
    $.ajax(paramsAJAX);
}

nextdom.report.removeAll = function (_params) {
    var paramsRequired = ['type','id'];
    var paramsSpecifics = {};
    try {
        nextdom.private.checkParamsRequired(_params || {}, paramsRequired);
    } catch (e) {
        (_params.error || paramsSpecifics.error || nextdom.private.default_params.error)(e);
        return;
    }
    var params = $.extend({}, nextdom.private.default_params, paramsSpecifics, _params || {});
    var paramsAJAX = nextdom.private.getParamsAJAX(params, 'Report', 'removeAll');
    paramsAJAX.data['id'] = _params.id;
    paramsAJAX.data['type'] = _params.type;
    $.ajax(paramsAJAX);
}
