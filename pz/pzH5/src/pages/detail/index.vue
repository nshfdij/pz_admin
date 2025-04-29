<template>
  <div class="container">
    <div class="header">
      <van-icon
        @click="goback"
        class="header-left"
        name="arrow-left"
        size="30"
      />订单详情
    </div>
    <schedule :item="isState(orderData.trade_state)" />
    <div class="tips">
      <div class="dzf" v-if="orderData.trade_state === '待支付'">
        <div class="text1">订单待支付</div>
        <div class="text2">
          请在<counter :second="formatTime" />
          内完成支付,超时订单自动取消
        </div>
        <div class="text3">
          <van-button @click="showcode = true" type="success" size="large"
            >立即支付(0.5元)</van-button
          >
        </div>
      </div>
      <div class="dzf" v-if="orderData.trade_state === '待服务'">
        <div class="text1">正在为您安排服务专员...</div>
        <div class="text2">请保持手机畅通，稍后将有服务专员与您联系</div>
      </div>
      <div class="dzf" v-if="orderData.trade_state === '已完成'">
        <div class="text1">服务已完成</div>
        <div class="text2">感谢您的使用，如有售后问题请联系客服</div>
      </div>
      <div class="dzf" v-if="orderData.trade_state === '已取消'">
        <div class="text1">订单已取消</div>
        <div class="text2">期待下次为您服务，如需帮助可咨询客服</div>
      </div>
    </div>
    <van-cell-group class="card">
      <div class="header-text">预约信息</div>

      <van-cell
        v-for="(item, key) in makeIfo"
        :title="item"
        :key="key"
        :value="formatData(key)"
      />
    </van-cell-group>
    <van-cell-group class="card">
      <div class="header-text">订单信息</div>
      <van-cell
        v-for="(item, key) in orderInfo"
        :title="item"
        :key="key"
        :value="formatData(key)"
      />
      <van-cell title="联系客服" value="疑问或投诉>" />
    </van-cell-group>

    <van-dialog :show-confirm-button="false" v-model:show="showcode">
      <van-icon name="cross" @click="closeCode" class="close" />
      <div>微信支付</div>
      <van-image height="150" width="150" :src="code" />
      <div>请使用本人微信扫描二维码</div>
    </van-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, getCurrentInstance, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import counter from "../../components/counter.vue";
import schedule from "../../components/schedule.vue";
import QRCode from "qrcode";

const route = useRoute();
const router = useRouter();
const { proxy } = getCurrentInstance();
const orderData = ref({});
const showcode = ref(false);
const code = ref();
const formatData = (key) => {
  if (key.indexOf(".") === -1) {
    if (key === "order_start_time") {
      return formatTimestamp(orderData.value[key]);
    }
    return orderData.value[key];
  }
  let arr = key.split(".").reduce((o, p) => {
    return (o || {})[p];
  }, orderData.value);
  return arr;
};
const formatTime = computed(() => {
  return orderData.value.order_start_time + 7200000 - Date.now();
});
const goback = (item) => {
  router.go(-1);
};
const isState = (state) => {
  let arr = {
    待支付: 10,
    待服务: 20,
    已完成: 30,
    已取消: 40,
  };
  return arr[state];
};
function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // 月份是从0开始的，所以需要+1
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
const makeIfo = ref({
  service_name: "预约服务",
  hospital_name: "就诊医院",
  starttime: "期望就诊时间",
  "client.name": "就诊人",
  "client.mobile": "就诊人电话",
  receiveAddress: "接送地址",
  demand: "其他需求",
});
const orderInfo = ref({
  "client.mobile": "联系电话",
  order_start_time: "下单时间",
  price: "应付金额",
  out_trade_no: "订单编号",
});
const closeCode = () => {
  showcode.value = false;
  getOrderData();
};
const getOrderData = async () => {
  let res = await proxy.$api.getOrderData({ oid: route.query.oid });
  console.log(res);
  if (res) {
    orderData.value = res;
    QRCode.toDataURL(res.code_url).then((url) => {
      code.value = url;
    });
  }
};
onMounted(() => {
  getOrderData();
});
</script>

<style lang="less" scoped>
.container {
  background-color: #f0f0f0;
  height: 100vh;
}
.header {
  background-color: #fff;
  line-height: 40px;
  text-align: center;
  .header-left {
    float: left;
  }
}
.card {
  margin: 15px 0;
  padding: 10px;
  .header-text {
    padding-left: 5px;
    line-height: 30px;
    font-size: 16px;
    font-weight: bold;
    border-left: 4px solid red;
  }
}
.dzf {
  padding: 20px;
  .text1 {
    font-size: 20px;
    font-weight: bold;
    line-height: 30px;
    color: #666;
  }
  .text2 {
    font-size: 14px;
    color: #666;
  }
  .text3 {
    text-align: center;
    .van-button {
      margin-top: 10px;
      margin-left: 10px;
      width: 80%;
      font-weight: bold;
    }
  }
}
::v-deep(.van-dialog__content) {
  text-align: center;
  padding: 20px;
  .close {
    position: absolute;
    left: 20px;
  }
}
</style>
