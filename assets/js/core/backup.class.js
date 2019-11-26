
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


 nextdom.backup = function() {
 };

 nextdom.backup.backup = function(_params) {
    var paramsRequired = [];
    var paramsSpecifics = {};
    try {
        nextdom.private.checkParamsRequired(_params || {}, paramsRequired);
    } catch (e) {
        (_params.error || paramsSpecifics.error || nextdom.private.default_params.error)(e);
        return;
    }
    var params = $.extend({}, nextdom.private.default_params, paramsSpecifics, _params || {});
    var paramsAJAX = nextdom.private.getParamsAJAX(params, 'NextDom', 'backup');
    $.ajax(paramsAJAX);
};


nextdom.backup.restoreLocal = function(_params) {
    var paramsRequired = [];
    var paramsSpecifics = {};
    try {
        nextdom.private.checkParamsRequired(_params || {}, paramsRequired);
    } catch (e) {
        (_params.error || paramsSpecifics.error || nextdom.private.default_params.error)(e);
        return;
    }
    var params = $.extend({}, nextdom.private.default_params, paramsSpecifics, _params || {});
    var paramsAJAX = nextdom.private.getParamsAJAX(params, 'NextDom', 'restore');
    paramsAJAX.data['backup'] = _params.backup;
    $.ajax(paramsAJAX);
};

nextdom.backup.remove = function(_params) {
    var paramsRequired = ['backup'];
    var paramsSpecifics = {};
    try {
        nextdom.private.checkParamsRequired(_params || {}, paramsRequired);
    } catch (e) {
        (_params.error || paramsSpecifics.error || nextdom.private.default_params.error)(e);
        return;
    }
    var params = $.extend({}, nextdom.private.default_params, paramsSpecifics, _params || {});
    var paramsAJAX = nextdom.private.getParamsAJAX(params, 'NextDom', 'removeBackup');
    paramsAJAX.data['backup'] = _params.backup;
    $.ajax(paramsAJAX);
};

nextdom.backup.uploadCloud = function(_params) {
    var paramsRequired = ['backup'];
    var paramsSpecifics = {};
    try {
        nextdom.private.checkParamsRequired(_params || {}, paramsRequired);
    } catch (e) {
        (_params.error || paramsSpecifics.error || nextdom.private.default_params.error)(e);
        return;
    }
    var params = $.extend({}, nextdom.private.default_params, paramsSpecifics, _params || {});
    var paramsAJAX = nextdom.private.getParamsAJAX(params, 'Repo', 'uploadCloud');
    paramsAJAX.data['backup'] = _params.backup;
    paramsAJAX.data['repo'] = _params.repo;
    $.ajax(paramsAJAX);
};

nextdom.backup.restoreCloud = function(_params) {
    var paramsRequired = ['backup','repo'];
    var paramsSpecifics = {};
    try {
        nextdom.private.checkParamsRequired(_params || {}, paramsRequired);
    } catch (e) {
        (_params.error || paramsSpecifics.error || nextdom.private.default_params.error)(e);
        return;
    }
    var params = $.extend({}, nextdom.private.default_params, paramsSpecifics, _params || {});
    var paramsAJAX = nextdom.private.getParamsAJAX(params, 'Repo', 'restoreCloud');
    paramsAJAX.data['backup'] = _params.backup;
    paramsAJAX.data['repo'] = _params.repo;
    $.ajax(paramsAJAX);
};

nextdom.backup.list = function(_params) {
    var paramsRequired = [];
    var paramsSpecifics = {};
    try {
        nextdom.private.checkParamsRequired(_params || {}, paramsRequired);
    } catch (e) {
        (_params.error || paramsSpecifics.error || nextdom.private.default_params.error)(e);
        return;
    }
    var params = $.extend({}, nextdom.private.default_params, paramsSpecifics, _params || {});
    var paramsAJAX = nextdom.private.getParamsAJAX(params, 'NextDom', 'listBackup');
    $.ajax(paramsAJAX);
};