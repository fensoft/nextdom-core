<?php

/* This file is part of NextDom Software.
 *
 * NextDom is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * NextDom Software is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with NextDom Software. If not, see <http://www.gnu.org/licenses/>.
 *
 * @Support <https://www.nextdom.org>
 * @Email   <admin@nextdom.org>
 * @Authors/Contributors: Sylvaner, Byackee, cyrilphoenix71, ColonelMoutarde, edgd1er, slobberbone, Astral0, DanoneKiD
 */

namespace NextDom\Controller;

use NextDom\Helpers\NextDomHelper;
use NextDom\Helpers\Render;
use NextDom\Helpers\Status;
use NextDom\Managers\CmdManager;
use NextDom\Managers\ConfigManager;
use NextDom\Managers\JeeObjectManager;
use NextDom\Managers\PluginManager;

class HistoryController extends BaseController
{

    public function __construct()
    {
        parent::__construct();
        Status::isConnectedAdminOrFail();
    }

    /**
     * Render history page
     *
     * @param Render $render Render engine
     * @param array $pageContent Page data
     *
     * @return string Content of history page
     *
     * @throws \Twig_Error_Loader
     * @throws \Twig_Error_Runtime
     * @throws \Twig_Error_Syntax
     */
    public function get(Render $render, array &$pageContent): string
    {
        $pageContent['historyDate'] = array(
            'start' => date('Y-m-d', strtotime(ConfigManager::byKey('history::defautShowPeriod') . ' ' . date('Y-m-d'))),
            'end' => date('Y-m-d'),
        );
        $pageContent['historyCmdsList'] = CmdManager::allHistoryCmd();
        $pageContent['historyPluginsList'] = PluginManager::listPlugin();
        $pageContent['historyEqLogicCategories'] = NextDomHelper::getConfiguration('eqLogic:category');
        $pageContent['historyObjectsList'] = JeeObjectManager::all();
        $pageContent['JS_POOL'][] = '/vendor/node_modules/vis/dist/vis.min.js';
        $pageContent['CSS_POOL'][] = '/vendor/node_modules/vis/dist/vis.min.css';
        $pageContent['JS_END_POOL'][] = '/public/js/desktop/diagnostic/history.js';
        $pageContent['JS_END_POOL'][] = '/public/js/adminlte/utils.js';

        return $render->get('/desktop/diagnostic/history.html.twig', $pageContent);
    }

}
