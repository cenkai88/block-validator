<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import axios from 'axios';
import qs from 'qs';

import Header from './components/Header.vue'
import UploadSecrion from './components/Upload.vue'
import DetailSection from './components/Detail.vue'
</script>

<script>
export default {
  name: "Upload",
  data() {
    return {
      nodeName: import.meta.env.VITE_NODE_NAME || '',
      proof: '',
      queryNodeName: '',
      detailData: {}
    };
  },
  async mounted() {
    const {proof, nodeName} = qs.parse(location.search.slice(1));
    if (nodeName) this.queryNodeName = nodeName;
    this.proof=proof;
    if (proof) {
      this.isLoading = true;
      const apiEndpoint = import.meta.env.VITE_API_ENDPOINT || ''
      const { data } = await axios.post(
        apiEndpoint ? apiEndpoint : `/api/check_claim`,
        {  proof  },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      this.detailData = data;
      this.isLoading = false;
    }
  }
}
</script>

<template>
  <Header v-if="queryNodeName" msg="科研数据溯源系统" :blocknodeName="queryNodeName" />
  <Header v-else msg="科研数据溯源系统" :blocknodeName="nodeName" />
  <DetailSection v-if="proof" :proof="proof" :detailData="detailData" />
  <UploadSecrion v-else />
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

body {
  margin: 0;
}
</style>
