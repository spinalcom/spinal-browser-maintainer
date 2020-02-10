/*
 * Copyright 2019 SpinalCom - www.spinalcom.com
 *
 *  This file is part of SpinalCore.
 *
 *  Please read all of the following terms and conditions
 *  of the Free Software license Agreement ("Agreement")
 *  carefully.
 *
 *  This Agreement is a legally binding contract between
 *  the Licensee (as defined below) and SpinalCom that
 *  sets forth the terms and conditions that govern your
 *  use of the Program. By installing and/or using the
 *  Program, you agree to abide by all the terms and
 *  conditions stated or referenced herein.
 *
 *  If you do not agree to abide by these terms and
 *  conditions, do not demonstrate your acceptance and do
 *  not install or use the Program.
 *  You should have received a copy of the license along
 *  with this file. If not, see
 *  <http://resources.spinalcom.com/licenses.pdf>.
 */

import { SpinalContextApp } from 'spinal-env-viewer-context-menu-service';
import { spinalPanelManagerService } from 'spinal-env-viewer-panel-manager-service';
import { PROCESS_TYPE } from "spinal-service-ticket/dist/Constants";

export class ConfigProcessButton extends SpinalContextApp {
  
  constructor() {
    super( 'Configure Process', 'Configure a process', {
      icon: 'settings',
      icon_type: 'in',
      backgroundColor: '#000000',
      fontColor: '#ffffff',
    } );
  }
  
  isShown( option ) {
    
   /* if (
      (option.selectedNode.hasOwnProperty( 'type' ))
      && (option.selectedNode.type.get() === PROCESS_TYPE)) {
      return Promise.resolve( true );
    } else {
      return Promise.resolve( -1 );
    }
   */
    return Promise.resolve( -1 );
  }
  
  action( option ) {
    const nodeInfo = Object.assign( {}, option.selectedNode );
    spinalPanelManagerService.openPanel( "ConfigProcess", nodeInfo );
  }
}
