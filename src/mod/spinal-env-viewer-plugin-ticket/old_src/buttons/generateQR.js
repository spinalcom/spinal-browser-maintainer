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
import GeographicContextService
  from "spinal-env-viewer-context-geographic-service";
import {
  SPINAL_RELATION_PTR_LST_TYPE,
  SpinalGraphService
} from "spinal-env-viewer-graph-service";
import { createContext } from "../utils";
import {
  QR_CODE_RELATION_NAME,
  QRCODE
} from "../constant";
import Vue from "vue";
export class GenerateQR extends SpinalContextApp {

  constructor() {
    super( 'Generer les QrCodes', 'Qrcode', {
      icon: 'nfc',
      icon_type: 'in',
      backgroundColor: '#000000',
    } );
  }

  isShown( option ) {

    if (option.selectedNode.type.get() === GeographicContextService.constants.CONTEXT_TYPE) {
      return Promise.resolve( true );
    } else {
      return Promise.resolve( -1 );
    }
  }
  
  action() {

    const nodes = SpinalGraphService.getNodes();
    
    createContext()
      .then( contextId => {
        if (contextId) {
          let count = 0;
          for (const id in nodes) {
            if (nodes.hasOwnProperty( id )) {
              const node = nodes[id];
              const relationName = SpinalGraphService.getRelationNames(id);
              if (node.info.type.get() === GeographicContextService.constants.ROOM_TYPE
                && !relationName.includes(QR_CODE_RELATION_NAME) ) {
                const qrcode = SpinalGraphService.generateQRcode( id );
                const qrNode = SpinalGraphService.createNode( { qrcode , type: QRCODE} );
                count++;
                SpinalGraphService
                  .addChildInContext( id,
                    qrNode, contextId,
                    QR_CODE_RELATION_NAME, SPINAL_RELATION_PTR_LST_TYPE )
                  .then( ( e ) => {
                  
                  } )
                  .catch( e => {
                    console.error( e );
                  } );

              }
            }
          }
          
          console.log(`${count} QRcode generated`)
        }
      } )
      .catch( ( e ) => {console.log( e );} );
    
  }


}
