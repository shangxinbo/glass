<template>
  <div class="container">
    <nav-bar title="添加客户" left-arrow @click-left="back" />
    <Form @submit="onSubmit">
      <field v-model="name" name="姓名" label="姓名" placeholder="请输入姓名" :rules="[{ required: true, message: '请填写姓名' }]" />
      <field v-model="tel" name="电话" label="电话" placeholder="请输入电话" />
      <field v-model="lens" name="镜片" label="镜片" placeholder="请输入镜片价格" />
      <field v-model="frame" name="镜架" label="镜架" placeholder="请输入镜架价格" />
      <field v-model="righteye" name="右眼" label="右眼" placeholder="请输入右眼值" />
      <field v-model="lefteye" name="左眼" label="左眼" placeholder="请输入左眼值" />
      <field v-model="distance" name="瞳距" label="瞳距" placeholder="请输入瞳距" />
      <field v-model="price" name="价格" label="价格" placeholder="请输入价格" />
      <field v-model="mark" name="备注" label="备注" placeholder="备注" />
      <div style="margin: 16px">
        <Button type="primary" round block native-type="submit">
          提交
        </Button>
      </div>
    </Form>
  </div>
</template>
<script setup>
import { NavBar, Form, Field, Button, showLoadingToast, showSuccessToast, showFailToast } from 'vant'
const name = ref('')
const tel = ref('')
const lens = ref('')
const frame = ref('')
const lefteye = ref('')
const righteye = ref('')
const distance = ref('')
const price = ref('')
const mark = ref('')
let loading = false

function back() {
  const router = useRouter()
  router.replace('/')
}

async function onSubmit() {

  if (name.value) {
    loading = true
    showLoadingToast({
      message: '加载中...',
      forbidClick: true,
      duration: 0
    })
    const { data } = await useFetch('/api/add', {
      method: 'post',
      body: {
        name: name.value,
        tel: tel.value,
        lens: lens.value,
        frame: frame.value,
        lefteye: lefteye.value,
        righteye: righteye.value,
        distance: distance.value,
        price: price.value,
        mark: mark.value,
      },
      watch: false
    })
    if (data.value.code == 0) {
      showSuccessToast('添加成功')
      back()
    } else {
      showFailToast('添加失败')
    }
    loading = false
  }
}
</script>
