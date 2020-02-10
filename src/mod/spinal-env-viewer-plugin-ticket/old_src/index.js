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

import vue from 'vue';
import store from './store';
import "./forgeExtension.js";

import { SpinalMountExtention } from 'spinal-env-viewer-panel-manager-service';
import { spinalContextMenuService } from 'spinal-env-viewer-context-menu-service';
import { SpinalServiceTicket } from 'spinal-service-ticket';
import { SpinalGraphService } from 'spinal-env-viewer-graph-service';

import AddProcessModal from './vue/AddProcessModal.vue';
import AddCategoryModal from "./vue/AddCategoryModal.vue";
import AddStepModal from "./vue/AddStepModal.vue";
import AddTicketModal from "./vue/AddTicketModal.vue";
import ModifyTicketModal from "./vue/ModifyTicketModal.vue";
import ConfigProcessModal from "./vue/ConfigProcessModal.vue";
import AddSubCategoryModal from "./vue/AddSubCategoryModal.vue";
import ShowQR from "./vue/ShowQR.vue";
import DisplayRoomTicketModal from "./vue/DisplayRoomTicketModal.vue";
import ShowInfo from "./vue/ShowInfo.vue";


import { AddProcessButton } from './buttons/AddProcessButton';
import { AddCategoyButton } from "./buttons/AddCategoyButton";
import { AddStepButton } from "./buttons/AddStepButton";
import { AddTicketButton } from "./buttons/AddTicketButton";
import { ModifyTicketButton } from "./buttons/ModifyTicketButton";
import { ConfigProcessButton } from "./buttons/ConfigProcessButton";
import { AddSubCategoryButton } from "./buttons/AddSubCategoyButton";
import { GenerateQR } from "./buttons/generateQR";
import { ShowQRButton } from "./buttons/ShowQRButton";
import { ShowRoom } from "./buttons/ShowRoom";
import { TiketPanelBtn } from "./buttons/PanelTicketButton";
import { DisplayRoomTicketsButton } from "./buttons/DisplayRoomTicketsButton";

const SIDE_BAR_HOOK_NAME = 'GraphManagerSideBar';
if (typeof SpinalServiceTicket.contextId === "undefined") {
  const interval = setInterval( () => {
    if (SpinalGraphService.graph.hasOwnProperty( 'info' )) {
      SpinalServiceTicket.init();
      clearInterval( interval );
    }
  } );
}

spinalContextMenuService.registerApp(SIDE_BAR_HOOK_NAME , new GenerateQR(), [3]);

spinalContextMenuService.registerApp( SIDE_BAR_HOOK_NAME, new ShowRoom(), [7]);

spinalContextMenuService.registerApp( SIDE_BAR_HOOK_NAME, new AddProcessButton(), [3] );
SpinalMountExtention.mount( {
  name: 'AddProcess',
  vueMountComponent: vue.extend(
    {
      store,
      render: h => h( AddProcessModal ),
      methods: {
        opened() {
          store.commit( 'TOGGLE_ADD_PROCESS' );
        },
        removed() {
        },
        closeDialog() {

        },
      },
    } ),
  parentContainer: document.body

} );

spinalContextMenuService.registerApp( SIDE_BAR_HOOK_NAME, new AddCategoyButton() , [3]);
SpinalMountExtention.mount( {
  name: 'AddCategory',
  vueMountComponent: vue.extend(
    {
      store,
      render: h => h( AddCategoryModal ),
      methods: {
        opened( option ) {
          store.commit( 'TOGGLE_ADD_CATEGORY' );
          store.commit( 'SET_SELECTED_NODE', option );
        },
        removed() {
        },
        closeDialog() {
  
        },
      }
    } ),
  parentContainer: document.body
  
} );


spinalContextMenuService.registerApp( SIDE_BAR_HOOK_NAME, new AddSubCategoryButton(), [3] );
SpinalMountExtention.mount( {
  name: 'AddSubCategory',
  vueMountComponent: vue.extend(
    {
      store,
      render: h => h( AddSubCategoryModal ),
      methods: {
        opened( option ) {
          store.commit( 'TOGGLE_ADD_SUB_CATEGORY' );
          store.commit( 'SET_SELECTED_NODE', option );
        },
        removed() {
        },
        closeDialog() {

        },
      }
    } ),
  parentContainer: document.body

} );


spinalContextMenuService.registerApp( SIDE_BAR_HOOK_NAME, new AddStepButton(), [3]);
SpinalMountExtention.mount( {
  name: 'AddStep',
  vueMountComponent: vue.extend(
    {
      store,
      render: h => h( AddStepModal ),
      methods: {
        opened( option ) {
          store.commit( 'TOGGLE_ADD_STEP' );
          store.commit( 'SET_SELECTED_NODE', option );
        },
        removed() {
        },
        closeDialog() {

        },
      }
    } ),
  parentContainer: document.body
  
} );


spinalContextMenuService.registerApp( SIDE_BAR_HOOK_NAME, new AddTicketButton(), [7] );
SpinalMountExtention.mount( {
  name: 'AddTicket',
  vueMountComponent: vue.extend(
    {
      store,
      render: h => h( AddTicketModal ),
      methods: {
        opened( option ) {
          store.commit( 'TOGGLE_ADD_TICKET' );
          store.commit( 'SET_SELECTED_NODE', option );
        },
        removed() {
        },
        closeDialog() {

        },
      }
    } ),
  parentContainer: document.body

} );


spinalContextMenuService.registerApp( SIDE_BAR_HOOK_NAME, new ModifyTicketButton(), [3] );
SpinalMountExtention.mount( {
  name: 'ModifyTicket',
  vueMountComponent: vue.extend(
    {
      store,
      render: h => h( ModifyTicketModal ),
      methods: {
        opened( option ) {
          store.commit( 'TOGGLE_MODIFY_TICKET' );
          store.commit( 'SET_SELECTED_NODE', option );
          store.dispatch('getProcess');
        },
        removed() {
        },
        closeDialog() {

        },
      }
    } ),
  parentContainer: document.body

} );


spinalContextMenuService.registerApp( SIDE_BAR_HOOK_NAME, new ConfigProcessButton(), [3] );
SpinalMountExtention.mount( {
  name: 'ConfigProcess',
  vueMountComponent: vue.extend(
    {
      store,
      render: h => h( ConfigProcessModal ),
      methods: {
        opened( option ) {
          store.commit( 'TOGGLE_CONFIG_PROCESS' );
          store.commit( 'SET_SELECTED_NODE', option );
        },
        removed() {
        },
        closeDialog() {

        },
      }
    } ),
  parentContainer: document.body

} );


spinalContextMenuService.registerApp( SIDE_BAR_HOOK_NAME, new ShowQRButton() );
SpinalMountExtention.mount( {
  name: 'Show_QR',
  vueMountComponent: vue.extend(
    {
      store,
      render: h => h( ShowQR ),
      methods: {
        opened( option ) {
          store.commit( 'TOGGLE_SHOW_QR', option );
        },
        removed() {
        },
        closeDialog() {
        },
      }
    } ),
  parentContainer: document.body

} );



spinalContextMenuService.registerApp(SIDE_BAR_HOOK_NAME, new DisplayRoomTicketsButton(), [15]);
SpinalMountExtention.mount({
  name: 'DisplayRoomTicket',
  vueMountComponent: vue.extend(DisplayRoomTicketModal),
  parentContainer: document.body

});
