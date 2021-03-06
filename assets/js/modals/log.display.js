/* This file is part of NextDom.
*
* NextDom is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
*
* NextDom is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
* GNU General Public License for more details.
*
* You should have received a copy of the GNU General Public License
* along with NextDom. If not, see <http://www.gnu.org/licenses/>.
*
* @Support <https://www.nextdom.org>
* @Email   <admin@nextdom.org>
* @Authors/Contributors: Sylvaner, Byackee, cyrilphoenix71, ColonelMoutarde, edgd1er, slobberbone, Astral0, DanoneKiD
*/

// Page init
loadInformations();
initEvents();

/**
 * Load informations in all forms of the page
 */
function loadInformations() {
    nextdom.log.autoupdate({
        log : log_name,
        default_search : log_default_search,
        display : $('#pre_log'),
        search : $('#in_globalLogSearch'),
        control : $('#bt_eventLogStopStart'),
    });
}

/**
 * Init events on the profils page
 */
function initEvents() {
    // Clear log button
    $("#bt_logClear").on('click', function(event) {
        nextdom.log.clear({
            log : log_name,
        });
    });

    // Remove log button
    $("#bt_logRemove").on('click', function(event) {
        nextdom.log.remove({
            log : log_name,
        });
    });

    // Download log button
    $('#bt_logDownload').click(function() {
        window.open('src/Api/downloadFile.php?pathfile=log/' + log_name, "_blank", null);
    });
}
