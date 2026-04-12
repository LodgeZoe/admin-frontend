<template>
  <div>
    <!-- 订单列表 -->
    <el-table :data="orders" v-loading="loading" border stripe>
      <el-table-column prop="id"          label="ID"       width="70" />
      <el-table-column prop="order_no"    label="订单号"   min-width="180" show-overflow-tooltip />
      <el-table-column label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="ORDER_STATUS_TYPE[row.status]">
            {{ ORDER_STATUS_MAP[row.status] ?? row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="金额" width="110">
        <template #default="{ row }">¥{{ row.total_amount.toFixed(2) }}</template>
      </el-table-column>
      <el-table-column prop="items_count"     label="商品数" width="80" />
      <el-table-column prop="contact_name"    label="联系人" width="100" />
      <el-table-column prop="contact_phone"   label="电话"   width="130" />
      <el-table-column prop="delivery_address" label="收货地址" min-width="180" show-overflow-tooltip />
      <el-table-column label="下单时间" width="165">
        <template #default="{ row }">{{ formatDate(row.created_at) }}</template>
      </el-table-column>
      <el-table-column label="操作" width="160" fixed="right">
        <template #default="{ row }">
          <el-button size="small" @click="openDetail(row)">详情</el-button>
          <el-button size="small" type="primary" @click="openStatusDialog(row)">改状态</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 订单详情 Drawer -->
    <el-drawer v-model="detailVisible" title="订单详情" size="480px">
      <div v-if="detailOrder" class="detail-wrap">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="订单号">{{ detailOrder.order_no }}</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="ORDER_STATUS_TYPE[detailOrder.status]">
              {{ ORDER_STATUS_MAP[detailOrder.status] }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="总金额">¥{{ detailOrder.total_amount.toFixed(2) }}</el-descriptions-item>
          <el-descriptions-item label="联系人">{{ detailOrder.contact_name ?? '—' }}</el-descriptions-item>
          <el-descriptions-item label="电话">{{ detailOrder.contact_phone ?? '—' }}</el-descriptions-item>
          <el-descriptions-item label="收货地址">{{ detailOrder.delivery_address ?? '—' }}</el-descriptions-item>
          <el-descriptions-item label="备注">{{ detailOrder.remark ?? '—' }}</el-descriptions-item>
          <el-descriptions-item label="支付时间">{{ detailOrder.paid_at ? formatDate(detailOrder.paid_at) : '—' }}</el-descriptions-item>
          <el-descriptions-item label="下单时间">{{ formatDate(detailOrder.created_at) }}</el-descriptions-item>
        </el-descriptions>

        <div class="items-title">商品明细</div>
        <el-table :data="detailOrder.items ?? []" border size="small">
          <el-table-column label="封面" width="60">
            <template #default="{ row }">
              <el-image
                v-if="row.product_image_url"
                :src="row.product_image_url"
                style="width:40px;height:40px;object-fit:cover;border-radius:3px"
              />
              <span v-else>—</span>
            </template>
          </el-table-column>
          <el-table-column prop="product_name" label="商品" min-width="120" show-overflow-tooltip />
          <el-table-column label="单价" width="80">
            <template #default="{ row }">¥{{ row.unit_price.toFixed(2) }}</template>
          </el-table-column>
          <el-table-column prop="quantity"    label="数量" width="60" />
          <el-table-column label="小计" width="80">
            <template #default="{ row }">¥{{ row.line_amount.toFixed(2) }}</template>
          </el-table-column>
        </el-table>
      </div>
      <div v-else class="detail-loading">
        <el-skeleton :rows="6" animated />
      </div>
    </el-drawer>

    <!-- 修改状态 Dialog -->
    <el-dialog v-model="statusDialogVisible" title="修改订单状态" width="360px">
      <el-form label-width="80px">
        <el-form-item label="当前状态">
          <el-tag :type="ORDER_STATUS_TYPE[statusEditRow?.status ?? '']">
            {{ ORDER_STATUS_MAP[statusEditRow?.status ?? ''] }}
          </el-tag>
        </el-form-item>
        <el-form-item label="新状态">
          <el-select v-model="newStatus" style="width:100%">
            <el-option
              v-for="(label, key) in ORDER_STATUS_MAP"
              :key="key"
              :label="label"
              :value="key"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="statusDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="statusSaving" @click="handleStatusSubmit">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import {
  listOrders, getOrder, updateOrderStatus,
  ORDER_STATUS_MAP, ORDER_STATUS_TYPE,
  type Order,
} from '../api/orders'

// ─── 列表 ─────────────────────────────────────────────────────────────────────

const orders  = ref<Order[]>([])
const loading = ref(false)

async function fetchOrders() {
  loading.value = true
  try {
    const res = await listOrders()
    orders.value = res.data.data
  } finally {
    loading.value = false
  }
}

onMounted(fetchOrders)

// ─── 工具函数 ─────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('zh-CN', { hour12: false })
}

// ─── 详情 Drawer ──────────────────────────────────────────────────────────────

const detailVisible = ref(false)
const detailOrder   = ref<Order | null>(null)

async function openDetail(row: Order) {
  detailVisible.value = true
  detailOrder.value   = null
  try {
    const res = await getOrder(row.id)
    detailOrder.value = res.data.data
  } catch {
    ElMessage.error('加载订单详情失败')
    detailVisible.value = false
  }
}

// ─── 修改状态 Dialog ──────────────────────────────────────────────────────────

const statusDialogVisible = ref(false)
const statusSaving        = ref(false)
const statusEditRow       = ref<Order | null>(null)
const newStatus           = ref('')

function openStatusDialog(row: Order) {
  statusEditRow.value   = row
  newStatus.value       = row.status
  statusDialogVisible.value = true
}

async function handleStatusSubmit() {
  if (!statusEditRow.value || !newStatus.value) return
  statusSaving.value = true
  try {
    await updateOrderStatus(statusEditRow.value.id, newStatus.value)
    ElMessage.success('状态已更新')
    statusDialogVisible.value = false
    await fetchOrders()
  } catch (e: any) {
    ElMessage.error(e?.response?.data?.message ?? '操作失败')
  } finally {
    statusSaving.value = false
  }
}
</script>

<style scoped>
.detail-wrap { padding: 0 4px; }
.items-title { margin: 20px 0 10px; font-weight: 600; font-size: 14px; }
.detail-loading { padding: 20px; }
</style>
