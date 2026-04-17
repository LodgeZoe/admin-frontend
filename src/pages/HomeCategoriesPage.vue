<template>
  <div>
    <div class="page-header">
      <el-button type="primary" @click="openDialog()">+ 新增分类</el-button>
    </div>

    <el-table :data="rows" v-loading="loading" border stripe>
      <el-table-column prop="id" label="ID" width="70" />
      <el-table-column label="图标" width="90">
        <template #default="{ row }">
          <span style="font-size: 18px">{{ row.emoji || '—' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="名称" min-width="180" />
      <el-table-column prop="sort_order" label="排序" width="80" />
      <el-table-column label="状态" width="90">
        <template #default="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'info'">
            {{ row.status === 1 ? '启用' : '停用' }}
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

    <el-dialog
      v-model="dialogVisible"
      :title="editingId ? '编辑分类' : '新增分类'"
      width="520px"
      :close-on-click-modal="false"
    >
      <el-form :model="form" :rules="rules" ref="formRef" label-width="90px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入分类名称" />
        </el-form-item>
        <el-form-item label="Emoji">
          <el-input v-model="form.emoji" placeholder="可选，如 🌹" />
        </el-form-item>
        <el-form-item label="排序值">
          <el-input-number v-model="form.sort_order" :min="0" style="width:100%" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio :value="1">启用</el-radio>
            <el-radio :value="0">停用</el-radio>
          </el-radio-group>
        </el-form-item>
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
  listHomeCategories, createHomeCategory, updateHomeCategory, deleteHomeCategory,
  type HomeCategory,
} from '../api/homeCategories'

const rows = ref<HomeCategory[]>([])
const loading = ref(false)

async function fetchRows() {
  loading.value = true
  try {
    const res = await listHomeCategories()
    rows.value = res.data.data
  } finally {
    loading.value = false
  }
}

onMounted(fetchRows)

const dialogVisible = ref(false)
const saving = ref(false)
const editingId = ref<number | null>(null)
const formRef = ref<FormInstance>()

const defaultForm = () => ({
  name: '',
  emoji: '',
  sort_order: 0,
  status: 1,
})

const form = reactive(defaultForm())

const rules: FormRules = {
  name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
}

function openDialog(row?: HomeCategory) {
  Object.assign(form, defaultForm())
  if (row) {
    editingId.value = row.id
    form.name = row.name
    form.emoji = row.emoji ?? ''
    form.sort_order = row.sort_order
    form.status = row.status
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
      name: form.name,
      emoji: form.emoji || null,
      sort_order: form.sort_order,
      status: form.status,
    }
    if (editingId.value) {
      await updateHomeCategory(editingId.value, payload)
      ElMessage.success('更新成功')
    } else {
      await createHomeCategory(payload)
      ElMessage.success('创建成功')
    }
    dialogVisible.value = false
    await fetchRows()
  } catch (e: any) {
    ElMessage.error(e?.response?.data?.message ?? '操作失败')
  } finally {
    saving.value = false
  }
}

async function handleDelete(row: HomeCategory) {
  await ElMessageBox.confirm(`确认删除分类「${row.name}」？`, '提示', { type: 'warning' })
  try {
    await deleteHomeCategory(row.id)
    ElMessage.success('删除成功')
    await fetchRows()
  } catch (e: any) {
    ElMessage.error(e?.response?.data?.message ?? '删除失败')
  }
}
</script>

<style scoped>
.page-header { margin-bottom: 16px; }
</style>

