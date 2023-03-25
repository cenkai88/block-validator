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
      result: import.meta.env.VITE_NODE_NAME || '',
      proof: '',
      detailData: {}
    };
  },
  async mounted() {
    const {proof} = qs.parse(location.search.slice(1));
    this.proof=proof;
    if (proof) {
      this.isLoading = true;
      const { data } = await axios.post(
        `/api/check_claim`,
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
  <Header msg="科研数据溯源系统" :blocknodeName="result" />
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
