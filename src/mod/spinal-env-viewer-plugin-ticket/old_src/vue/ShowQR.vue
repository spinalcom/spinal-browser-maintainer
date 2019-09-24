<!--
  - Copyright 2019 SpinalCom - www.spinalcom.com
  -
  -  This file is part of SpinalCore.
  -
  -  Please read all of the following terms and conditions
  -  of the Free Software license Agreement ("Agreement")
  -  carefully.
  -
  -  This Agreement is a legally binding contract between
  -  the Licensee (as defined below) and SpinalCom that
  -  sets forth the terms and conditions that govern your
  -  use of the Program. By installing and/or using the
  -  Program, you agree to abide by all the terms and
  -  conditions stated or referenced herein.
  -
  -  If you do not agree to abide by these terms and
  -  conditions, do not demonstrate your acceptance and do
  -  not install or use the Program.
  -  You should have received a copy of the license along
  -  with this file. If not, see
  -  <http://resources.spinalcom.com/licenses.pdf>.
  -->

<template>

    <md-dialog :md-active="displayQRCode">
        <img :src="currentQR" alt="qrcode" height="500px" width="500px"/>
        <md-dialog-actions>
            <md-button class="md-primary" v-on:click="onClose">
                Close
            </md-button>
        </md-dialog-actions>
    </md-dialog>
</template>

<script>
  import { mapState } from 'vuex';

  export default {
    name: "ShowQR",
    computed: mapState( ['currentQR', 'displayQRCode'] ),
    methods: {
      onClose: function () {
        this.$store.commit( 'TOGGLE_SHOW_QR' )
      }
    }

  }
</script>

<style scoped>

</style>