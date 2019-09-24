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
import {
  SPINAL_TICKET_SERVICE_TARGET_RELATION_NAME,
  SPINAL_TICKET_SERVICE_TICKET_TYPE
} from "spinal-service-ticket/dist/Constants";


export class ShowRoom extends SpinalContextApp {
  
  constructor() {
    super( 'Localiser', 'Localiser', {
      icon: 'all_out',
      icon_type: 'in',
      backgroundColor: '#000000',
      fontColor: '#ffffff',
    } );
  }
  
  static predicat( node ) {
    return node.info.type.get() === "BIMObject";
  }
  
  isShown( option ) {
    if (option.selectedNode.type.get() === SPINAL_TICKET_SERVICE_TICKET_TYPE) {
      return Promise.resolve( true );
    }
    
    return Promise.resolve( -1 );
  }
  
  action( option ) {
    let realNode = SpinalGraphService.getRealNode( option.selectedNode.id.get() );
    this.viewer = window.spinal.ForgeViewer.viewer;
    let self = this;
    realNode.find( [
        SPINAL_TICKET_SERVICE_TARGET_RELATION_NAME,
        "hasBIMObject",
        'hasReferenceObject'
      ],
      ShowRoom.predicat
      )
      .then( lst => {
        self.viewer.clearSelection();
        let result = lst.map( x => x.info.dbid.get() );
        self.viewer.select( result );
      } );
  }
  
}