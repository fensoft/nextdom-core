
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


 nextdom.plan = function () {
 };

 nextdom.plan.cache = Array();

 nextdom.plan.remove = function (_params) {
    var paramsRequired = [];
    var paramsSpecifics = {};
    try {
        nextdom.private.checkParamsRequired(_params || {}, paramsRequired);
    } catch (e) {
        (_params.error || paramsSpecifics.error || nextdom.private.default_params.error)(e);
        return;
    }
    var params = $.extend({}, nextdom.private.default_params, paramsSpecifics, _params || {});
    var paramsAJAX = nextdom.private.getParamsAJAX(params, 'Plan', 'remove');
    paramsAJAX.data['id'] = _params.id || '';
    paramsAJAX.data['link_type'] = _params.link_type || '';
    paramsAJAX.data['link_id'] = _params.link_id || '';
    paramsAJAX.data['planHeader_id'] = _params.planHeader_id || '';
    $.ajax(paramsAJAX);
};

nextdom.plan.execute = function (_params) {
    var paramsRequired = ['id'];
    var paramsSpecifics = {global: false};
    try {
        nextdom.private.checkParamsRequired(_params || {}, paramsRequired);
    } catch (e) {
        (_params.error || paramsSpecifics.error || nextdom.private.default_params.error)(e);
        return;
    }
    var params = $.extend({}, nextdom.private.default_params, paramsSpecifics, _params || {});
    var paramsAJAX = nextdom.private.getParamsAJAX(params, 'Plan', 'execute');
    paramsAJAX.data['id'] = _params.id;
    $.ajax(paramsAJAX);
};


nextdom.plan.save = function (_params) {
    var paramsRequired = ['plans'];
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

    var paramsAJAX = nextdom.private.getParamsAJAX(params, 'Plan', 'save');
    paramsAJAX.data['plans'] = json_encode(_params.plans);
    $.ajax(paramsAJAX);
};


nextdom.plan.byId = function (_params) {
    var paramsRequired = ['id'];
    var paramsSpecifics = {};
    try {
        nextdom.private.checkParamsRequired(_params || {}, paramsRequired);
    } catch (e) {
        (_params.error || paramsSpecifics.error || nextdom.private.default_params.error)(e);
        return;
    }
    var params = $.extend({}, nextdom.private.default_params, paramsSpecifics, _params || {});
    var paramsAJAX = nextdom.private.getParamsAJAX(params, 'Plan', 'get');
    paramsAJAX.data['id'] = _params.id;
    $.ajax(paramsAJAX);
};

nextdom.plan.getObjectPlan = function (_params) {
    var paramsRequired = ['id'];
    var paramsSpecifics = {};
    try {
        nextdom.private.checkParamsRequired(_params || {}, paramsRequired);
    } catch (e) {
        (_params.error || paramsSpecifics.error || nextdom.private.default_params.error)(e);
        return;
    }
    var params = $.extend({}, nextdom.private.default_params, paramsSpecifics, _params || {});
    var paramsAJAX = nextdom.private.getParamsAJAX(params, 'Plan', 'getObjectPlan');
    paramsAJAX.data['id'] = _params.id;
    paramsAJAX.data['version'] = _params.version || 'dplan';
    $.ajax(paramsAJAX);
};

nextdom.plan.create = function (_params) {
    var paramsRequired = ['plan'];
    var paramsSpecifics = {};
    try {
        nextdom.private.checkParamsRequired(_params || {}, paramsRequired);
    } catch (e) {
        (_params.error || paramsSpecifics.error || nextdom.private.default_params.error)(e);
        return;
    }
    var params = $.extend({}, nextdom.private.default_params, paramsSpecifics, _params || {});
    var paramsAJAX = nextdom.private.getParamsAJAX(params, 'Plan', 'create');
    paramsAJAX.data['plan'] = json_encode(_params.plan);
    paramsAJAX.data['version'] = _params.version;
    $.ajax(paramsAJAX);
};

nextdom.plan.copy = function (_params) {
    var paramsRequired = [];
    var paramsSpecifics = {};
    try {
        nextdom.private.checkParamsRequired(_params || {}, paramsRequired);
    } catch (e) {
        (_params.error || paramsSpecifics.error || nextdom.private.default_params.error)(e);
        return;
    }
    var params = $.extend({}, nextdom.private.default_params, paramsSpecifics, _params || {});
    var paramsAJAX = nextdom.private.getParamsAJAX(params, 'Plan', 'copy');
    paramsAJAX.data['id'] = _params.id || '';
    paramsAJAX.data['link_type'] = _params.link_type || '';
    paramsAJAX.data['link_id'] = _params.link_id || '';
    paramsAJAX.data['planHeader_id'] = _params.planHeader_id || '';
    $.ajax(paramsAJAX);
};

nextdom.plan.byPlanHeader = function (_params) {
    var paramsRequired = ['id'];
    var paramsSpecifics = {};
    try {
        nextdom.private.checkParamsRequired(_params || {}, paramsRequired);
    } catch (e) {
        (_params.error || paramsSpecifics.error || nextdom.private.default_params.error)(e);
        return;
    }
    var params = $.extend({}, nextdom.private.default_params, paramsSpecifics, _params || {});
    var paramsAJAX = nextdom.private.getParamsAJAX(params, 'Plan', 'planHeader');
    paramsAJAX.data['planHeader_id'] = _params.id;
    paramsAJAX.data['noHtml'] = _params.noHtml;
    paramsAJAX.data['version'] = _params.version || 'dplan';
    $.ajax(paramsAJAX);
};

nextdom.plan.removeImageHeader = function (_params) {
    var paramsRequired = ['planHeader_id'];
    var paramsSpecifics = {};
    try {
        nextdom.private.checkParamsRequired(_params || {}, paramsRequired);
    } catch (e) {
        (_params.error || paramsSpecifics.error || nextdom.private.default_params.error)(e);
        return;
    }
    var params = $.extend({}, nextdom.private.default_params, paramsSpecifics, _params || {});
    var paramsAJAX = nextdom.private.getParamsAJAX(params, 'Plan', 'removeImageHeader');
    paramsAJAX.data['id'] = _params.planHeader_id;
    $.ajax(paramsAJAX);
};

nextdom.plan.saveHeader = function (_params) {
    var paramsRequired = ['planHeader'];
    var paramsSpecifics = {};
    try {
        nextdom.private.checkParamsRequired(_params || {}, paramsRequired);
    } catch (e) {
        (_params.error || paramsSpecifics.error || nextdom.private.default_params.error)(e);
        return;
    }
    var params = $.extend({}, nextdom.private.default_params, paramsSpecifics, _params || {});
    var paramsAJAX = nextdom.private.getParamsAJAX(params, 'Plan', 'savePlanHeader');
    paramsAJAX.data['planHeader'] = json_encode(_params.planHeader);
    $.ajax(paramsAJAX);
};

nextdom.plan.copyHeader = function (_params) {
    var paramsRequired = ['id', 'name'];
    var paramsSpecifics = {};
    try {
        nextdom.private.checkParamsRequired(_params || {}, paramsRequired);
    } catch (e) {
        (_params.error || paramsSpecifics.error || nextdom.private.default_params.error)(e);
        return;
    }
    var params = $.extend({}, nextdom.private.default_params, paramsSpecifics, _params || {});
    var paramsAJAX = nextdom.private.getParamsAJAX(params, 'Plan', 'copyPlanHeader');
    paramsAJAX.data['id'] = _params.id;
    paramsAJAX.data['name'] = _params.name;
    $.ajax(paramsAJAX);
};

nextdom.plan.removeHeader = function (_params) {
    var paramsRequired = ['id'];
    var paramsSpecifics = {};
    try {
        nextdom.private.checkParamsRequired(_params || {}, paramsRequired);
    } catch (e) {
        (_params.error || paramsSpecifics.error || nextdom.private.default_params.error)(e);
        return;
    }
    var params = $.extend({}, nextdom.private.default_params, paramsSpecifics, _params || {});
    var paramsAJAX = nextdom.private.getParamsAJAX(params, 'Plan', 'removePlanHeader');
    paramsAJAX.data['id'] = _params.id;
    $.ajax(paramsAJAX);
};

nextdom.plan.getHeader = function (_params) {
    var paramsRequired = ['id'];
    var paramsSpecifics = {};
    try {
        nextdom.private.checkParamsRequired(_params || {}, paramsRequired);
    } catch (e) {
        (_params.error || paramsSpecifics.error || nextdom.private.default_params.error)(e);
        return;
    }
    var params = $.extend({}, nextdom.private.default_params, paramsSpecifics, _params || {});
    var paramsAJAX = nextdom.private.getParamsAJAX(params, 'Plan', 'getPlanHeader');
    paramsAJAX.data['id'] = _params.id;
    paramsAJAX.data['code'] = _params.code;
    $.ajax(paramsAJAX);
};

nextdom.plan.allHeader = function (_params) {
    var paramsRequired = [];
    var paramsSpecifics = {
        pre_success: function(data) {
            nextdom.plan.cache.all = data.result;
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
    if (isset(nextdom.plan.cache.all)) {
        params.success(nextdom.plan.cache.all);
        return;
    }
    var paramsAJAX = nextdom.private.getParamsAJAX(params, 'Plan', 'allHeader');
    $.ajax(paramsAJAX);
};
