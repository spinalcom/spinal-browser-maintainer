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

import vuex from 'vuex';
import vue from 'vue';
import { SpinalGraphService } from 'spinal-env-viewer-graph-service'
import { SpinalServiceTicket } from "spinal-service-ticket";
import { SPINAL_TICKET_SERVICE_PROCESS_RELATION_NAME,
  SPINAL_TICKET_SERVICE_STEP_RELATION_NAME } from "spinal-service-ticket/dist/Constants";



vue.use( vuex );

const store = new vuex.Store( {
  state: {
    displayAddProcess: false,
    displayAddSentence: false,
    displayAddStep: false,
    displayAddTicket: false,
    displayModifyTicket: false,
    displayConfigProcess: false,
    displayAddCategory: false,
    displayAddSubCategory: false,
    displayQRCode: false,
    selectedNode: {},
    processSteps: [],
    processes: [],
    currentQR: '',
    categoryByProcess: new Map()
  },
  mutations: {
    TOGGLE_SHOW_QR: ( state, option ) => {
      const prev = state.displayQRCode;
      state.displayQRCode = !prev;
      state.currentQR = option;
    },
    ADD_CATEGORY_BY_PROCESS: ( state, option ) => {
      state.categoryByProcess.set( option.process, option.categories );
    },
    ADD_PROCESSES: ( state, processes ) => {
      for (const process of processes) {
        if (!state.processes.includes( process )) {
          state.processes.push( process );
        }
      }
    },
    
    ADD_PROCESS: ( state, process ) => {
      
      if (!state.processes.includes( process )) {
        state.processes.push( process );
      }
      
    },
    
    TOGGLE_ADD_PROCESS: ( state ) => {
      const prev = state.displayAddProcess;
      state.displayAddProcess = !prev;
    },
    
    TOGGLE_ADD_SUB_CATEGORY: ( state ) => {
      const prev = state.displayAddSubCategory;
      state.displayAddSubCategory = !prev;
    },
    
    TOGGLE_ADD_CATEGORY: ( state ) => {
      const prev = state.displayAddCategory;
      state.displayAddCategory = !prev;
    },
    
    TOGGLE_ADD_STEP: ( state ) => {
      const prev = state.displayAddStep;
      state.displayAddStep = !prev;
    },
    
    TOGGLE_ADD_TICKET: ( state ) => {
      const prev = state.displayAddTicket;
      state.displayAddTicket = !prev;
    },
    
    TOGGLE_MODIFY_TICKET: ( state ) => {
      const prev = state.displayModifyTicket;
      state.displayModifyTicket = !prev;
    },
    
    TOGGLE_CONFIG_PROCESS: ( state ) => {
      const prev = state.displayConfigProcess;
      state.displayConfigProcess = !prev;
    },
    
    SET_SELECTED_NODE: ( state, node ) => {
      state.selectedNode = node;
    },
    
  },
  actions: {
    getProcess: ( context ) => {
      SpinalServiceTicket.getContext().then( contextId => {
        return SpinalGraphService.getChildren( contextId, [SPINAL_TICKET_SERVICE_PROCESS_RELATION_NAME] )
      } ).then( children => {
        
        for (let i = 0; i < children.length; i++) {
          const processId = children[i].id.get();
          context.commit('ADD_PROCESS', processId);
          SpinalServiceTicket.getCategoriesFromProcess( processId )
            .then( categories => {
              context.commit( 'ADD_CATEGORY_BY_PROCESS', {
                process: processId,
                categories
              } );
            } ).catch( e => console.error( e ) )
        }
      } )
      
    },
    addProcesses: ( context, processes ) => {
      context.commit( 'ADD_PROCESSES', processes );
      for (const process of processes) {
        SpinalServiceTicket.getCategoriesFromProcess( process )
          .then( categories => {
            context.commit( 'ADD_CATEGORY_BY_PROCESS', {
              process,
              categories
            } );
          } ).catch( e => console.error( e ) )
        ;
      }
    }
  },
  getters: {
    getCategories: (state) =>  (processId) => {
      return  SpinalServiceTicket.getCategoriesFromProcess(processId);
    }
  }
} );

export default store;
