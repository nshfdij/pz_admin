<template>
  <div class="container">
    <div class="header">我的订单</div>
    <van-tabs @click-tab="clickTab" v-model:active="active">
      <van-tab title="全部" name="" />
      <van-tab title="待支付" name="1" />
      <van-tab title="待服务" name="2" />
      <van-tab title="已完成" name="3" />
      <van-tab title="已取消" name="4" />

      <van-row
        @click="goDetail(item)"
        v-for="item in orderList"
        :key="item.out_trade_no"
      >
        <van-col span="5"
          ><van-image
            width="50"
            radius="5"
            height="50"
            :src="item.serviceImg"
          />
        </van-col>
        <van-col span="14">
          <div class="text1">{{ item.service_name }}</div>
          <div class="text2">
            <div>{{ item.hospital_name }}</div>
            <div>预约时间:{{ item.starttime }}</div>
          </div>
        </van-col>
        <van-col
          class="text2"
          span="5"
          :style="{ color: color[item.trade_state] }"
          >{{ item.trade_state }}
          <counter :second="item.timer" v-if="item.trade_state === '待支付'" />
        </van-col>
      </van-row>
    </van-tabs>
    <div class="bottom-text">没有更多了</div>
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, onMounted } from "vue";
import counter from "../../components/counter.vue";
import { useRouter, useRoute } from "vue-router";
const router = useRouter();
const route = useRoute();
const { proxy } = getCurrentInstance();

const orderList = ref();
const active = ref("");
const color = ref({
  待支付: "#ffa200",
  待服务: "#1da6fd",
  已完成: "#21c521",
});
const getOrderList = async (state) => {
  let res = await proxy.$api.getOrderList({ state });
  if (res) {
    orderList.value = res.map((item) => {
      item.timer = item.order_start_time + 7200000 - Date.now();
      return item;
    });
    console.log(orderList.value);
  }
};
const clickTab = async (item) => {
  getOrderList(item.name);
};
const goDetail = (item) => {
  router.push(`/detail?oid=${item.out_trade_no}`);
};

onMounted(() => {
  if (route.query.active) {
    active.value = route.query.active;
  }
  getOrderList();
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
}
.van-row {
  background-color: #fff;
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  .text1 {
    font-size: 16px;
    line-height: 25px;
    font-weight: bold;
  }
  .text2 {
    font-size: 14px;
    line-height: 20px;
    color: #999999;
  }
}
.bottom-text {
  line-height: 50px;
  text-align: center;
  color: #999999;
}
</style>
