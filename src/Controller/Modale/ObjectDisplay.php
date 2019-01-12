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

namespace NextDom\Controller\Modale;

use NextDom\Managers\ScenarioManager;
use NextDom\Managers\ScenarioElementManager;
use NextDom\Helpers\Utils;
use NextDom\Helpers\Render;
use NextDom\Helpers\Status;
use NextDom\Exceptions\CoreException;

class ObjectDisplay extends BaseAbstractModale
{

    public function __construct()
    {
        parent::__construct();
        Status::isConnectedOrFail();
    }

    /**
     * Render object display modal
     *
     * @param Render $render Render engine
     *
     * @throws CoreException
     */
    public function get(Render $render)
    {

        $cmdClass = Utils::init('class');
        if ($cmdClass == '' || !class_exists($cmdClass)) {
            throw new CoreException(__('La classe demandée n\'existe pas : ') . $cmdClass);
        }
        if (!method_exists($cmdClass, 'byId')) {
            throw new CoreException(__('La classe demandée n\'a pas de méthode byId : ') . $cmdClass);
        }

        $object = $cmdClass::byId(Utils::init('id'));
        if (!is_object($object)) {
            throw new CoreException(__('L\'objet n\'existe pas : ') . $cmdClass);
        }

        $data = \utils::o2a($object);
        if (count($data) == 0) {
            throw new CoreException(__('L\'objet n\'a aucun élément : ') . print_r($data, true));
        }
        $otherInfo = [];

        if ($cmdClass == 'cron' && $data['class'] == 'scenario' && $data['function'] == 'doIn') {
            $scenario        = ScenarioManager::byId($data['option']['scenario_id']);
            //TODO: $array ???
            $scenarioElement = ScenarioElementManager::byId($data['option']['scenarioElement_id']);
            if (is_object($scenarioElement) && is_object($scenario)) {
                $otherInfo['doIn'] = __('Scénario : ') . $scenario->getName() . "\n" . str_replace(array('"'), array("'"), $scenarioElement->export());
            }
        }

        $pageContent = [];

        if (count($otherInfo) > 0) {
            $pageContent['otherData'] = [];
            foreach ($otherInfo as $otherInfoKey => $otherInfoValue) {
                $pageContent['otherData'][$otherInfoKey]          = [];
                $pageContent['otherData'][$otherInfoKey]['value'] = $otherInfoValue;
                // TODO: Always long-text ???
                if (is_array($otherInfoValue)) {
                    $pageContent['otherData'][$otherInfoKey]['type']  = 'json';
                    $pageContent['otherData'][$otherInfoKey]['value'] = json_encode($otherInfoValue);
                } else if (strpos($otherInfoValue, "\n")) {
                    $pageContent['otherData'][$otherInfoKey]['type'] = 'long-text';
                } else {
                    $pageContent['otherData'][$otherInfoKey]['type'] = 'simple-text';
                }
            }
        }
        // TODO : Reduce loops
        $pageContent['data'] = [];
        foreach ($data as $dataKey => $dataValue) {
            $pageContent['data'][$dataKey]          = [];
            $pageContent['data'][$dataKey]['value'] = $dataValue;
            if (is_array($dataValue)) {
                $pageContent['data'][$dataKey]['type']  = 'json';
                $pageContent['data'][$dataKey]['value'] = json_encode($dataValue);
            } elseif (strpos($dataValue, "\n")) {
                $pageContent['data'][$dataKey]['type'] = 'long-text';
            } else {
                $pageContent['data'][$dataKey]['type'] = 'simple-text';
            }
        }
        return $render->get('/modals/object.display.html.twig', $pageContent);
    }

}
