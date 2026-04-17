<template>
  <div>
    <div class="page-header">
      <el-button type="primary" @click="openDialog()">+ 新增 Banner</el-button>
    </div>

    <el-table :data="banners" v-loading="loading" border stripe>
      <el-table-column label="图片" width="90">
        <template #default="{ row }">
          <el-image
            v-if="row.image_url"
            :src="row.image_url"
            style="width:60px;height:60px;object-fit:cover;border-radius:4px"
            fit="cover"
          />
          <span v-else>—</span>
        </template>
      </el-table-column>
      <el-table-column prop="id" label="ID" width="70" />
      <el-table-column prop="title" label="标题" min-width="160" show-overflow-tooltip />
      <el-table-column prop="sub_title" label="副标题" min-width="200" show-overflow-tooltip />
      <el-table-column prop="link_type" label="跳转类型" width="110" />
      <el-table-column prop="link_value" label="跳转值" min-width="160" show-overflow-tooltip />
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
      :title="editingId ? '编辑 Banner' : '新增 Banner'"
      width="620px"
      :close-on-click-modal="false"
    >
      <el-form :model="form" :rules="rules" ref="formRef" label-width="90px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="副标题">
          <el-input v-model="form.sub_title" placeholder="可选" />
        </el-form-item>
        <el-form-item label="图片URL" prop="image_url">
          <el-input v-model="form.image_url" placeholder="请输入图片URL" />
        </el-form-item>
        <el-form-item label="预览">
          <el-image
            v-if="form.image_url"
            :src="form.image_url"
            style="width:120px;height:120px;object-fit:cover;border-radius:6px"
            fit="cover"
          />
          <span v-else>—</span>
        </el-form-item>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="跳转类型">
              <el-select v-model="form.link_type" placeholder="可选" style="width:100%">
                <el-option label="无" value="none" />
                <el-option label="商品" value="product" />
                <el-option label="页面" value="page" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="跳转值">
              <el-input v-model="form.link_value" placeholder="如商品ID或页面路径" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="排序值">
              <el-input-number v-model="form.sort_order" :min="0" style="width:100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态">
              <el-radio-group v-model="form.status">
                <el-radio :value="1">启用</el-radio>
                <el-radio :value="0">停用</el-radio>
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
  listBanners, createBanner, updateBanner, deleteBanner,
  type Banner,
} from '../api/banners'

const banners = ref<Banner[]>([])
const loading = ref(false)

async function fetchBanners() {
  loading.value = true
  try {
    const res = await listBanners()
    banners.value = res.data.data
  } finally {
    loading.value = false
  }
}

onMounted(fetchBanners)

const dialogVisible = ref(false)
const saving = ref(false)
const editingId = ref<number | null>(null)
const formRef = ref<FormInstance>()

const defaultForm = () => ({
  title: '',
  sub_title: '',
  image_url: '',
  link_type: 'none' as string,
  link_value: '',
  sort_order: 0,
  status: 1,
})

const form = reactive(defaultForm())

const rules: FormRules = {
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  image_url: [{ required: true, message: '请输入图片URL', trigger: 'blur' }],
}

function openDialog(row?: Banner) {
  Object.assign(form, defaultForm())
  if (row) {
    editingId.value = row.id
    form.title = row.title
    form.sub_title = row.sub_title ?? ''
    form.image_url = row.image_url
    form.link_type = row.link_type ?? 'none'
    form.link_value = row.link_value ?? ''
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
      title: form.title,
      sub_title: form.sub_title || null,
      image_url: form.image_url,
      link_type: form.link_type || null,
      link_value: form.link_value || null,
      sort_order: form.sort_order,
      status: form.status,
    }
    if (editingId.value) {
      await updateBanner(editingId.value, payload)
      ElMessage.success('更新成功')
    } else {
      await createBanner(payload)
      ElMessage.success('创建成功')
    }
    dialogVisible.value = false
    await fetchBanners()
  } catch (e: any) {
    ElMessage.error(e?.response?.data?.message ?? '操作失败')
  } finally {
    saving.value = false
  }
}

async function handleDelete(row: Banner) {
  await ElMessageBox.confirm(`确认删除 Banner「${row.title}」？`, '提示', { type: 'warning' })
  try {
    await deleteBanner(row.id)
    ElMessage.success('删除成功')
    await fetchBanners()
  } catch (e: any) {
    ElMessage.error(e?.response?.data?.message ?? '删除失败')
  }
}
</script>

<style scoped>
.page-header { margin-bottom: 16px; }
</style>

