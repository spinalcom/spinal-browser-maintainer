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
import { SpinalGraphService } from "spinal-env-viewer-graph-service";
import { spinalPanelManagerService } from "spinal-env-viewer-panel-manager-service";
import { SPINAL_TICKET_SERVICE_TARGET_RELATION_NAME } from "spinal-service-ticket/dist/Constants";
import GeographicContextService
  from "spinal-env-viewer-context-geographic-service";

export class DisplayRoomTicketsButton extends SpinalContextApp {
  
  constructor() {
    super( 'Afficher tous les tickets associer a une room', 'Afficher tous les tickets associer a une room', {
      icon: 'attach_money',
      icon_type: 'in',
      backgroundColor: '#000000',
      fontColor: '#ffffff',
    } );
  }
  
  isShown( option ) {
    if (typeof option.selectedNode.id !== 'undefined') {
      const relationName = SpinalGraphService.getRelationNames( option.selectedNode.id.get() );
      if (relationName.includes( SPINAL_TICKET_SERVICE_TARGET_RELATION_NAME) &&
        option.selectedNode.type.get()  === GeographicContextService.constants.ROOM_TYPE) {
        return Promise.resolve( true );
      }
      else {
        return Promise.resolve( -1 );
      }
    }
    return Promise.resolve( -1 );
  }
  
  action( option ) {
    SpinalGraphService.getChildren( option.selectedNode.id.get(), [SPINAL_TICKET_SERVICE_TARGET_RELATION_NAME] )
      .then( children => {
          if (children.length > 0) {
            const opt = {
              roomName: option.selectedNode.name.get(),
              tickets: children
            };
            spinalPanelManagerService.openPanel( "DisplayRoomTicket", opt );
          }
        }
      );
  }
}
