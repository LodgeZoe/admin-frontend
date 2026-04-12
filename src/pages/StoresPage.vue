<template>
  <div>
    <!-- 顶部操作栏 -->
    <div class="page-header">
      <el-button type="primary" @click="openDialog()">+ 新增门店</el-button>
    </div>

    <!-- 表格 -->
    <el-table :data="stores" v-loading="loading" border stripe>
      <el-table-column label="封面" width="80">
        <template #default="{ row }">
          <el-image
            v-if="row.cover_url"
            :src="row.cover_url"
            style="width:50px;height:50px;object-fit:cover;border-radius:4px"
            fit="cover"
          />
          <span v-else>—</span>
        </template>
      </el-table-column>
      <el-table-column prop="id"    label="ID"     width="70" />
      <el-table-column prop="name"  label="门店名称" min-width="120" />
      <el-table-column prop="tag"   label="标签"   width="100" />
      <el-table-column prop="address" label="地址" min-width="180" show-overflow-tooltip />
      <el-table-column prop="hours"   label="营业时间" min-width="140" show-overflow-tooltip />
      <el-table-column prop="phone"   label="电话"   width="130" />
      <el-table-column prop="sort_order" label="排序" width="80" />
      <el-table-column label="状态" width="90">
        <template #default="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'info'">
            {{ row.status === 1 ? '展示' : '隐藏' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="160" fixed="right">
        <template #default="{ row }">
          <el-button size="small" @click="openDialog(row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增/编辑 Dialog -->
    <el-dialog
      v-model="dialogVisible"
      :title="editingId ? '编辑门店' : '新增门店'"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form :model="form" :rules="rules" ref="formRef" label-width="90px">
        <el-form-item label="门店名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入门店名称" />
        </el-form-item>
        <el-form-item label="标签">
          <el-input v-model="form.tag" placeholder="如：24小时、旗舰店（可选）" />
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="form.address" placeholder="请输入门店地址" />
        </el-form-item>
        <el-form-item label="营业时间" prop="hours">
          <el-input v-model="form.hours" placeholder="如：09:00 - 22:00" />
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入联系电话" />
        </el-form-item>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="纬度" prop="latitude">
              <el-input-number v-model="form.latitude" :precision="6" style="width:100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="经度" prop="longitude">
              <el-input-number v-model="form.longitude" :precision="6" style="width:100%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="封面图URL">
          <el-input v-model="form.cover_url" placeholder="封面图URL（可选）" />
        </el-form-item>
        <el-form-item label="温馨提示">
          <el-input v-model="form.tips" type="textarea" :rows="2" placeholder="如：停车场信息、注意事项（可选）" />
        </el-form-item>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="排序值">
              <el-input-number v-model="form.sort_order" :min="0" style="width:100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态">
              <el-radio-group v-model="form.status">
                <el-radio :value="1">展示</el-radio>
                <el-radio :value="0">隐藏</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="saving" @click="handleSubmit">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import {
  listStores, createStore, updateStore, deleteStore,
  type Store,
} from '../api/stores'

// ─── 列表 ─────────────────────────────────────────────────────────────────────

const stores  = ref<Store[]>([])
const loading = ref(false)

async function fetchStores() {
  loading.value = true
  try {
    const res = await listStores()
    stores.value = res.data.data
  } finally {
    loading.value = false
  }
}

onMounted(fetchStores)

// ─── 表单 ─────────────────────────────────────────────────────────────────────

const dialogVisible = ref(false)
const saving        = ref(false)
const editingId     = ref<number | null>(null)
const formRef       = ref<FormInstance>()

const defaultForm = () => ({
  name:       '',
  tag:        '',
  address:    '',
  hours:      '',
  phone:      '',
  latitude:   0,
  longitude:  0,
  cover_url:  '',
  tips:       '',
  sort_order: 0,
  status:     1,
})

const form = reactive(defaultForm())

const rules: FormRules = {
  name:      [{ required: true, message: '请输入门店名称', trigger: 'blur' }],
  address:   [{ required: true, message: '请输入门店地址', trigger: 'blur' }],
  hours:     [{ required: true, message: '请输入营业时间', trigger: 'blur' }],
  phone:     [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
  latitude:  [{ required: true, message: '请输入纬度', trigger: 'blur' }],
  longitude: [{ required: true, message: '请输入经度', trigger: 'blur' }],
}

function openDialog(row?: Store) {
  Object.assign(form, defaultForm())
  if (row) {
    editingId.value   = row.id
    form.name         = row.name
    form.tag          = row.tag
    form.address      = row.address
    form.hours        = row.hours
    form.phone        = row.phone
    form.latitude     = row.latitude
    form.longitude    = row.longitude
    form.cover_url    = row.cover_url
    form.tips         = row.tips
    form.sort_order   = row.sort_order
    form.status       = row.status
  } else {
    editingId.value = null
  }
  dialogVisible.value = true
}

async function handleSubmit() {
  await formRef.value?.validate()
  saving.value = true
  try {
    const payload = {
      name:       form.name,
      tag:        form.tag || undefined,
      address:    form.address,
      hours:      form.hours,
      phone:      form.phone,
      latitude:   form.latitude,
      longitude:  form.longitude,
      cover_url:  form.cover_url || undefined,
      tips:       form.tips || undefined,
      sort_order: form.sort_order,
      status:     form.status,
    }
    if (editingId.value) {
      await updateStore(editingId.value, payload)
      ElMessage.success('更新成功')
    } else {
      await createStore(payload)
      ElMessage.success('创建成功')
    }
    dialogVisible.value = false
    await fetchStores()
  } catch (e: any) {
    ElMessage.error(e?.response?.data?.message ?? '操作失败')
  } finally {
    saving.value = false
  }
}

// ─── 删除 ─────────────────────────────────────────────────────────────────────

async function handleDelete(row: Store) {
  await ElMessageBox.confirm(`确认删除门店「${row.name}」？`, '提示', {
    type: 'warning',
  })
  try {
    await deleteStore(row.id)
    ElMessage.success('删除成功')
    await fetchStores()
  } catch (e: any) {
    ElMessage.error(e?.response?.data?.message ?? '删除失败')
  }
}
</script>

<style scoped>
.page-header { margin-bottom: 16px; }
</style>
