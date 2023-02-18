<template>
  <div class="container">
    <nav-bar />
    <nav-bar title="眼镜店-客户管理" right-text="添加" fixed @click-right="toAdd" />
    <search v-model="keyword" placeholder="请输入搜索关键词(姓名或手机号)" background="#1989fa70" @search="onSearch" />
    <list v-if="customers.length > 0" v-model:loading="loading" :finished="finished" @load="onLoad">
      <cell v-for="item in customers" :key="item.id">
        <template #title>
          <span>{{ item.name }}</span>
        </template>
        <template #label>
          <span class="info-item">镜片：{{ item.lens }} / 镜架：{{ item.frame }}</span>
          <span class="info-item">右眼：{{ item.righteye }}</span>
          <span class="info-item">左眼：{{ item.lefteye }}</span>
          <span v-if="item.distance" class="info-item">瞳距：{{ item.distance }}</span>
          <span v-if="item.mark" class="info-item">备注：{{ item.mark }}</span>
        </template>
        <template #default>
          <span class="info-item">{{ item.tel }}</span>
          <span v-if="item.price" class="info-item">{{ item.price }}元</span>
          <span v-if="item.update_time" class="info-item">{{dateFormat(item.update_time)}}</span>
        </template>
      </cell>
    </list>
    <back-top style="z-index:1000;width:3rem;height:3rem"> </back-top>
  </div>
</template>
<script setup>
import { NavBar, Search, Cell, List, BackTop } from 'vant'
import dayjs from 'dayjs'

const pageSize = 50
const keyword = ref('')
const loading = ref(false) // 组件加载状态
const finished = ref(false)
const customers = ref([])

let page = 1
let loadStatus = false   // 数据是否加载中，防抖

function dateFormat(val) {
  return dayjs(val).format('YYYY-MM-DD')
}

function toAdd() {
  const router = useRouter()
  router.replace({ path: '/add' })
}

async function onLoad() {
  if (loadStatus) return
  loadStatus = true
  page += 1
  const data = await getData()

  if (data.length < pageSize) {
    // 数据全部加载完
    finished.value = true
  }
  customers.value = [...customers.value, ...data]
  loading.value = false
  loadStatus = false

}

async function onSearch() {
  if (loadStatus) return
  loadStatus = true
  page = 1
  const data = await getData()
  loadStatus = false
  finished.value = false
  customers.value = data
}

async function getData() {
  try {
    const { data, error } = await useFetch('/api/list', {
      query: {
        page: page,
        pageSize: pageSize,
        keyword: keyword.value
      },
      watch: false
    })
    if (error.value) return [] // 异常处理
    return data.value.data
  } catch (e) {
    return []
  }

}

customers.value = await getData()

</script>
<style>
.container {
  width: 100vw;
  height: 100vh;
}

.info-item {
  display: block;
  word-break: keep-all;
}
</style>
