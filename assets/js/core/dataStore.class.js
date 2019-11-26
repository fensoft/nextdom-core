
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


 nextdom.dataStore = function () {
 };


 nextdom.dataStore.save = function (_params) {
    var paramsRequired = ['id', 'value', 'type', 'key', 'link_id'];
    var paramsSpecifics = {};
    try {
        nextdom.private.checkParamsRequired(_params || {}, paramsRequired);
    } catch (e) {
        (_params.error || paramsSpecifics.error || nextdom.private.default_params.error)(e);
        return;
    }
    var params = $.extend({}, nextdom.private.default_params, paramsSpecifics, _params || {});
    var paramsAJAX = nextdom.private.getParamsAJAX(params, 'DataStore', 'save');
    paramsAJAX.async =  _params.async || true;
    paramsAJAX.data['id'] = _params.id;
    paramsAJAX.data['value'] = _params.value;
    paramsAJAX.data['type'] = _params.type;
    paramsAJAX.data['key'] = _params.key;
    paramsAJAX.data['link_id'] = _params.link_id;
    $.ajax(paramsAJAX);
};

nextdom.dataStore.all = function (_params) {
    var paramsRequired = ['type','usedBy'];
    var paramsSpecifics = {};
    try {
        nextdom.private.checkParamsRequired(_params || {}, paramsRequired);
    } catch (e) {
        (_params.error || paramsSpecifics.error || nextdom.private.default_params.error)(e);
        return;
    }
    var params = $.extend({}, nextdom.private.default_params, paramsSpecifics, _params || {});
    var paramsAJAX = nextdom.private.getParamsAJAX(params, 'DataStore', 'all');
    paramsAJAX.data['type'] = _params.type;
    paramsAJAX.data['usedBy'] = _params.usedBy;
    $.ajax(paramsAJAX);
};

nextdom.dataStore.getSelectModal = function (_options, callback) {
    var dataStoreModal = $("#mod_insertDataStoreValue");
    if (!isset(_options)) {
        _options = {};
    }
    if (dataStoreModal.length !== 0) {
        dataStoreModal.remove();
    }
    $('body').append('<div id="mod_insertDataStoreValue" title="{{Sélectionner une variable}}" ></div>');
    dataStoreModal.dialog({
        closeText: '',
        autoOpen: false,
        modal: true,
        height: 250,
        width: 800
    });
    jQuery.ajaxSetup({async: false});
    dataStoreModal.load('index.php?v=d&modal=dataStore.human.insert');
    jQuery.ajaxSetup({async: true});
    mod_insertDataStore.setOptions(_options);
    dataStoreModal.dialog('option', 'buttons', {
        "Annuler": function () {
            $(this).dialog("close");
        },
        "Valider": function () {
            var retour = {};
            retour.human = mod_insertDataStore.getValue();
            retour.id = mod_insertDataStore.getId();
            if ($.trim(retour) != '') {
                callback(retour);
            }
            $(this).dialog('close');
        }
    });
    dataStoreModal.dialog('open');
};


nextdom.dataStore.remove = function(_params) {
    var paramsRequired = ['id'];
    var paramsSpecifics = {};
    try {
        nextdom.private.checkParamsRequired(_params || {}, paramsRequired);
    } catch (e) {
        (_params.error || paramsSpecifics.error || nextdom.private.default_params.error)(e);
        return;
    }
    var params = $.extend({}, nextdom.private.default_params, paramsSpecifics, _params || {});
    var paramsAJAX = nextdom.private.getParamsAJAX(params, 'DataStore', 'remove');
    paramsAJAX.url = 'core/ajax/dataStore.ajax.php';
    paramsAJAX.data['id'] = _params.id;
    $.ajax(paramsAJAX);
};