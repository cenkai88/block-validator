
<script>
import axios from "axios";
import { generateETag } from '../utils';

export default {
  name: "Upload",
  data() {
    return {
      result: "",
      isLoading: false,
      isHovered: false,
      imagePreviewUrl: undefined,
      imageLoader: undefined,
    };
  },
  methods: {
    reset() {
      this.result = "";
      this.isLoading = false;
      this.imagePreviewUrl = undefined;
    },
    onDrop(e) {
      e.stopPropagation();
      e.preventDefault();
      this.isHovered = false;
      const file = e.dataTransfer.files[0];
      this.fileLoader.readAsArrayBuffer(file);
      this.imageLoader.readAsDataURL(file);
      // this.submit(file);
    },
    async getUpload({ target }) {
      const file = target.files[0];
      this.fileLoader.readAsArrayBuffer(file);
      this.imageLoader.readAsDataURL(file);
      // this.submit(file);
    },
    async submit(proof) {
      // const params = new FormData();
      // params.append("file", file, file.name);
      const apiEndpoint = import.meta.env.VITE_API_ENDPOINT || ''
      this.isLoading = true;
      try {
      const { data } = await axios.post(
        apiEndpoint ? apiEndpoint : `/api/check_claim`,
        {  proof  },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
        if (!data?.blockNumber || !data?.storageTs) {
          // not found
          this.result = ['无法匹配区块链记录，该数据未在已有原始数据中记录'];
        } else {
          // found
          this.result = [`区块高度: ${data?.blockNumber || '未知'}`, `上链用户Id: ${data?.userId || '未知'}`, `上链时间: ${(new Date(data?.storageTs)).toLocaleString() || '未知'}`, `备注信息: ${data?.extra || ''}`];
        }
      } catch (err) {
        this.result = ['无法匹配区块链记录，该数据未在已有原始数据中记录'];
      }
      this.isLoading = false;
    },
  },
  async mounted() {
    const dropbox = document.getElementById("drop-area");
    dropbox.addEventListener("drop", this.onDrop.bind(this), false);
    dropbox.addEventListener("dragleave", (e) => {
      e.stopPropagation();
      e.preventDefault();
      this.isHovered = false;
    });
    dropbox.addEventListener("dragenter", (e) => {
      e.stopPropagation();
      e.preventDefault();
      this.isHovered = true;
    });
    dropbox.addEventListener("dragover", (e) => {
      e.stopPropagation();
      e.preventDefault();
      this.isHovered = true;
    });

    this.imageLoader = new FileReader();
    this.fileLoader = new FileReader();
    this.imageLoader.onload = (e) => {
      this.imagePreviewUrl = this.imageLoader.result;
    };
    this.fileLoader.onload = ({ target }) => {
      const etag = generateETag(target.result);
      this.submit(etag);
    };
  }
};
</script>

<template>
  <div class="row">
    <div
      class="upload-container"
      id="drop-area"
      :style="isHovered ? 'border-color: #71c0e5; border-width: 3px;' : ''"
    >
      <div v-if="!imagePreviewUrl" class="upload-box">
        <div class="upload-box-text">
          <div>请将需要追溯的图片拖到此框中，或点击下方按钮上传文件</div>
          <div style="margin-top: 12px">
            <input
              type="file"
              accept="image/png, image/jpeg, image/jpg, image/tiff"
              @change="getUpload"
            />
          </div>
        </div>
      </div>
      <div v-else class="image-preview">
        <div class="image-preview-image">
          <img :src="imagePreviewUrl" style="max-width: 100%; max-height: 59vh" />
        </div>
      </div>
      <div v-if="isLoading" class="image-preview-loading">
        <img src="../assets/loading.svg" class="loading-icon" />
      </div>
    </div>
  </div>
  <div v-if="result.length" class="result">
    <div v-for="item in result" :key="item">{{item}}</div>
    <img @click="reset" class="reset-icon" src="../assets/reset.svg" />
  </div>
</template>

<style scoped>
.row {
  display: flex;
  justify-content: space-evenly;
  margin: 24px 0;
}
.upload-container {
  margin-top: 40px;
  border: 2px dashed #cccccc;
  width: 42vw;
  height: 60vh;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
}
.upload-box-text {
  position: absolute;
  font-weight: 500;
  font-size: 18px;
  bottom: 30%;
  left: 20vw;
  transform: translateX(-50%);
  text-align: center;
}
.result {
  position: absolute;
  top: calc(60vh + 140px);
  font-weight: 600;
  width: 100%;
  line-height: 24px;
}
.image-preview-loading {
  position: absolute;
  background: rgba(0, 0, 0, 0.5);
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.loading-icon {
  width: 32px;
  height: 32px;
  animation: rotate 2s infinite forwards;
  top: calc(50% - 16px);
  position: absolute;
}
.reset-icon {
  width: 24px;
  height: 24px;
  line-height: 24px;
  margin-left: 12px;
  transform: translateY(5px);
  cursor: pointer;
}
@keyframes rotate {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
