
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


 nextdom.repo = function() {
 };

 nextdom.repo.install = function (_params) {
     var paramsRequired = ['id','repo'];
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
     var paramsAJAX = nextdom.private.getParamsAJAX(params, 'Repo', 'install');
     paramsAJAX.data['repo'] = _params.repo;
     paramsAJAX.data['id'] = _params.id;
     paramsAJAX.data['version'] = _params.version || 'stable';
     $.ajax(paramsAJAX);
 };

 nextdom.repo.remove = function (_params) {
     var paramsRequired = ['id','repo'];
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
     var paramsAJAX = nextdom.private.getParamsAJAX(params, 'Repo', 'remove');
     paramsAJAX.data['repo'] = _params.repo;
     paramsAJAX.data['id'] = _params.id;
     $.ajax(paramsAJAX);
 };

 nextdom.repo.setRating = function (_params) {
     var paramsRequired = ['id','rating','repo'];
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
     var paramsAJAX = nextdom.private.getParamsAJAX(params, 'Repo', 'setRating');
     paramsAJAX.data['repo'] = _params.repo;
     paramsAJAX.data['id'] = _params.id;
     paramsAJAX.data['rating'] = _params.rating;
     $.ajax(paramsAJAX);
 };

 nextdom.repo.test = function (_params) {
     var paramsRequired = ['repo'];
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
     var paramsAJAX = nextdom.private.getParamsAJAX(params, 'Repo', 'test');
     paramsAJAX.data['repo'] = _params.repo;
     $.ajax(paramsAJAX);
 };


 nextdom.repo.backupList = function (_params) {
     var paramsRequired = ['repo'];
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
     var paramsAJAX = nextdom.private.getParamsAJAX(params, 'Repo', 'backupList');
     paramsAJAX.data['repo'] = _params.repo;
     $.ajax(paramsAJAX);
 };