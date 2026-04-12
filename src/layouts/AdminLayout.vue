<template>
  <el-container class="admin-layout">
    <!-- 侧边栏 -->
    <el-aside width="200px">
      <div class="logo">Florist Admin</div>
      <el-menu
        router
        :default-active="$route.path"
        background-color="#1d1f2b"
        text-color="#a0a3b1"
        active-text-color="#ffffff"
      >
        <el-menu-item index="/products">
          <el-icon><Goods /></el-icon>
          <span>商品管理</span>
        </el-menu-item>
        <el-menu-item index="/stores">
          <el-icon><Location /></el-icon>
          <span>门店管理</span>
        </el-menu-item>
        <el-menu-item index="/orders">
          <el-icon><List /></el-icon>
          <span>订单管理</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <!-- 主内容区 -->
    <el-container>
      <el-header>
        <span class="header-title">{{ pageTitle }}</span>
        <el-button type="danger" text @click="handleLogout">退出登录</el-button>
      </el-header>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Goods, Location, List } from '@element-plus/icons-vue'
import { useAuthStore } from '../stores/auth'
import { logout } from '../api/auth'

const route  = useRoute()
const router = useRouter()
const auth   = useAuthStore()

const titleMap: Record<string, string> = {
  '/products': '商品管理',
  '/stores':   '门店管理',
  '/orders':   '订单管理',
}
const pageTitle = computed(() => titleMap[route.path] ?? 'Florist Admin')

async function handleLogout() {
  try { await logout() } catch { /* ignore */ }
  auth.logout()
  router.push('/login')
}
</script>

<style scoped>
.admin-layout { height: 100vh; }

.el-aside {
  background-color: #1d1f2b;
  display: flex;
  flex-direction: column;
}

.logo {
  height: 60px;
  line-height: 60px;
  text-align: center;
  color: #fff;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 1px;
  border-bottom: 1px solid #2e3044;
}

.el-menu { border-right: none; flex: 1; }

.el-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #e8e8e8;
  background: #fff;
}

.header-title { font-size: 16px; font-weight: 500; color: #333; }

.el-main { background: #f5f6fa; }
</style>
