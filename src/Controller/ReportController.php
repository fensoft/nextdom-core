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

use NextDom\Helpers\PagesController;
use NextDom\Managers\PluginManager;
use NextDom\Helpers\Render;
use NextDom\Helpers\Status;

class ReportController extends PagesController
{
    public function __construct()
    {
        Status::initConnectState();
        Status::isConnectedAdminOrFail();
    }
    
    /**
     * Render report page
     *
     * @param Render $render Render engine
     * @param array $pageContent Page data
     *
     * @return string Content of report page
     *
     * @throws \NextDom\Exceptions\CoreException
     * @throws \Twig_Error_Loader
     * @throws \Twig_Error_Runtime
     * @throws \Twig_Error_Syntax
     */
    public static function report(Render $render, array &$pageContent): string
    {
        $pageContent['JS_END_POOL'][] = '/public/js/desktop/diagnostic/report.js';
        $report_path = NEXTDOM_ROOT . '/data/report/';
        $pageContent['reportViews'] = [];
        $allViews = \view::all();
        foreach ($allViews as $view) {
            $viewData = [];
            $viewData['id'] = $view->getId();
            $viewData['icon'] = $view->getDisplay('icon');
            $viewData['name'] = $view->getName();
            $viewData['number'] = count(ls($report_path . '/view/' . $view->getId(), '*'));
            $pageContent['reportViews'][] = $viewData;
        }
        $pageContent['reportPlans'] = [];
        $allPlanHeader = \planHeader::all();
        foreach ($allPlanHeader as $plan) {
            $planData = [];
            $planData['id'] = $plan->getId();
            $planData['icon'] = $plan->getConfiguration('icon');
            $planData['name'] = $plan->getName();
            $planData['number'] = count(ls($report_path . '/plan/' . $plan->getId(), '*'));
            $pageContent['reportPlans'][] = $planData;
        }
        $pageContent['reportPlugins'] = [];
        $pluginManagerList = PluginManager::listPlugin(true);
        foreach ($pluginManagerList as $plugin) {
            if ($plugin->getDisplay() != '') {
                $pluginData = [];
                $pluginData['id'] = $plugin->getId();
                $pluginData['name'] = $plugin->getName();
                $pluginData['number'] = count(ls($report_path . '/plugin/' . $plugin->getId(), '*'));
                $pageContent['reportPlugins'][] = $pluginData;
            }
        }
        $pageContent['JS_END_POOL'][] = '/public/js/adminlte/utils.js';

        return $render->get('/desktop/diagnostic/reports-view.html.twig', $pageContent);
    }
    
    /**
     * Render reportsAdmin page
     *
     * @param Render $render Render engine
     * @param array $pageContent Page data
     *
     * @return string Content of report_admin page
     *
     * @throws \NextDom\Exceptions\CoreException
     * @throws \Twig_Error_Loader
     * @throws \Twig_Error_Runtime
     * @throws \Twig_Error_Syntax
     */
    public static function reportsAdmin(Render $render, array &$pageContent): string
    {
        global $CONFIG;

        $pageContent['adminDbConfig'] = $CONFIG['db'];
        
        $pageContent['JS_END_POOL'][] = '/public/js/desktop/params/reports_admin.js';
        $pageContent['JS_END_POOL'][] = '/public/js/adminlte/utils.js';

        return $render->get('/desktop/params/reports_admin.html.twig', $pageContent);
    }
}
