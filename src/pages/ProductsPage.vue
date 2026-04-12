<template>
  <div>
    <!-- 顶部操作栏 -->
    <div class="page-header">
      <el-button type="primary" @click="openDialog()">+ 新增商品</el-button>
    </div>

    <!-- 表格 -->
    <el-table :data="products" v-loading="loading" border stripe>
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
      <el-table-column prop="id"        label="ID"       width="70" />
      <el-table-column prop="name"      label="名称"     min-width="140" />
      <el-table-column prop="subtitle"  label="副标题"   min-width="160" show-overflow-tooltip />
      <el-table-column label="价格" width="140">
        <template #default="{ row }">
          <span>¥{{ row.price.toFixed(2) }}</span>
          <span v-if="row.original_price" class="original-price">¥{{ row.original_price.toFixed(2) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="sale_count"  label="销量"   width="80" />
      <el-table-column prop="sort_order"  label="排序"   width="80" />
      <el-table-column label="状态" width="90">
        <template #default="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'info'">
            {{ row.status === 1 ? '上架' : '下架' }}
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
      :title="editingId ? '编辑商品' : '新增商品'"
      width="560px"
      :close-on-click-modal="false"
    >
      <el-form :model="form" :rules="rules" ref="formRef" label-width="90px">
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入商品名称" />
        </el-form-item>
        <el-form-item label="副标题" prop="subtitle">
          <el-input v-model="form.subtitle" placeholder="副标题（可选）" />
        </el-form-item>
        <el-form-item label="封面图URL" prop="cover_url">
          <el-input v-model="form.cover_url" placeholder="请输入封面图URL" />
        </el-form-item>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="售价" prop="price">
              <el-input-number v-model="form.price" :min="0" :precision="2" style="width:100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="原价">
              <el-input-number v-model="form.original_price" :min="0" :precision="2" style="width:100%" placeholder="可选" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="销量">
              <el-input-number v-model="form.sale_count" :min="0" style="width:100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="排序值">
              <el-input-number v-model="form.sort_order" :min="0" style="width:100%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="描述">
          <el-input v-model="form.description" type="textarea" :rows="3" placeholder="商品描述（可选）" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio :value="1">上架</el-radio>
            <el-radio :value="0">下架</el-radio>
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
  listProducts, createProduct, updateProduct, deleteProduct,
  type Product,
} from '../api/products'

// ─── 列表 ─────────────────────────────────────────────────────────────────────

const products = ref<Product[]>([])
const loading  = ref(false)

async function fetchProducts() {
  loading.value = true
  try {
    const res = await listProducts()
    products.value = res.data.data
  } finally {
    loading.value = false
  }
}

onMounted(fetchProducts)

// ─── 表单 ─────────────────────────────────────────────────────────────────────

const dialogVisible = ref(false)
const saving        = ref(false)
const editingId     = ref<number | null>(null)
const formRef       = ref<FormInstance>()

const defaultForm = () => ({
  name:           '',
  subtitle:       '',
  cover_url:      '',
  price:          0,
  original_price: undefined as number | undefined,
  sale_count:     0,
  sort_order:     0,
  description:    '',
  status:         1,
})

const form = reactive(defaultForm())

const rules: FormRules = {
  name:      [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
  cover_url: [{ required: true, message: '请输入封面图URL', trigger: 'blur' }],
  price:     [{ required: true, message: '请输入售价', trigger: 'blur' }],
}

function openDialog(row?: Product) {
  Object.assign(form, defaultForm())
  if (row) {
    editingId.value          = row.id
    form.name                = row.name
    form.subtitle            = row.subtitle ?? ''
    form.cover_url           = row.cover_url
    form.price               = row.price
    form.original_price      = row.original_price ?? undefined
    form.sale_count          = row.sale_count
    form.sort_order          = row.sort_order
    form.description         = row.description ?? ''
    form.status              = row.status
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
      name:           form.name,
      subtitle:       form.subtitle || null,
      cover_url:      form.cover_url,
      price:          form.price,
      original_price: form.original_price ?? null,
      sale_count:     form.sale_count,
      sort_order:     form.sort_order,
      description:    form.description || null,
      status:         form.status,
    }
    if (editingId.value) {
      await updateProduct(editingId.value, payload)
      ElMessage.success('更新成功')
    } else {
      await createProduct(payload)
      ElMessage.success('创建成功')
    }
    dialogVisible.value = false
    await fetchProducts()
  } catch (e: any) {
    ElMessage.error(e?.response?.data?.message ?? '操作失败')
  } finally {
    saving.value = false
  }
}

// ─── 删除 ─────────────────────────────────────────────────────────────────────

async function handleDelete(row: Product) {
  await ElMessageBox.confirm(`确认删除商品「${row.name}」？`, '提示', {
    type: 'warning',
  })
  try {
    await deleteProduct(row.id)
    ElMessage.success('删除成功')
    await fetchProducts()
  } catch (e: any) {
    ElMessage.error(e?.response?.data?.message ?? '删除失败')
  }
}
</script>

<style scoped>
.page-header { margin-bottom: 16px; }
.original-price { margin-left: 6px; color: #999; text-decoration: line-through; font-size: 12px; }
</style>
