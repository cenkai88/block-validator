<script>

export default {
  name: "Detail",
  props: {
    proof: {
      type: String
    },
    detailData: {
      type: Object
    }
  },
  data() {
    return {
      nodeMapping : {
        '5DSCeFz7Vs56Nj7o6rBHDbYShxFsw3e2YPm3MBr4baDKLsFk': '测试节点001',
        '5EHPZ6HJmQeFyE8a9KauGuMnGL5VBMS9J1qYrDNCnTpHpuKw': '西南医院节点'
      }
    };
  },
  methods: {
  },
  async mounted() {
  }
};
</script>

<template>
  <div class="container">
    <div class="field">
      <div class="label">区块高度</div>
      <div class="value">{{detailData?.blockNumber ? detailData.blockNumber : '暂无数据'}}</div>
    </div>
    <div class="field">
      <div class="label">上链数据哈希</div>
      <div class="value">{{detailData?.blockNumber ? proof : '暂无数据'}}</div>
    </div>
    <div class="field">
      <div class="label">上链来源节点</div>
      <div class="value">{{detailData?.accountId ? (nodeMapping[detailData.accountId] || '未知节点'):'暂无数据'}}</div> 
    </div>
    <div class="field">
      <div class="label">上链用户Id</div>
      <div class="value">{{detailData?.userId ?detailData.userId : '暂无数据'}}</div>
    </div>
    <div class="field">
      <div class="label">上链区块打包时间</div>
      <div class="value">{{detailData?.storageTs ? (new Date(detailData.storageTs)).toLocaleString() : '暂无数据'}}</div>
    </div>
    <div class="field">
      <div class="label">附加信息</div>
      <div class="value">{{detailData?.extra? detailData.extra:'暂无数据'}}</div>
    </div>
  </div>
</template>

<style scoped>
.container {
  padding: 24px;
  text-align: left;
  width: 70%;
}

.field {
  border-bottom: 1px solid #ccc;
  padding: 8px 8px 16px;
}

.label {
  font-size: 14px;
  color: #666;
  margin-bottom: 4px;
}

.value {
  color: #111;
  font-weight: 500;
  font-size: 20px;
}

.loading-icon {
  width: 32px;
  height: 32px;
  animation: rotate 2s infinite forwards;
  top: calc(50% - 16px);
  position: absolute;
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
