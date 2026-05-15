<template>
  <div class="image-uploader">
    <!-- 预览区 / 点击触发上传 -->
    <div
      class="uploader-box"
      :class="{ 'has-image': modelValue }"
      @click="triggerSelect"
    >
      <el-image
        v-if="modelValue"
        :src="modelValue"
        fit="cover"
        class="preview-img"
      />
      <div v-else class="placeholder">
        <el-icon :size="28" color="#c0c4cc"><Plus /></el-icon>
        <span>点击上传</span>
      </div>
      <!-- 上传中遮罩 -->
      <div v-if="uploading" class="uploading-mask">
        <el-icon class="is-loading" :size="24" color="#fff"><Loading /></el-icon>
      </div>
    </div>

    <!-- 隐藏的 input -->
    <input
      ref="inputRef"
      type="file"
      accept="image/jpeg,image/png,image/gif,image/webp"
      style="display:none"
      @change="handleFileChange"
    />

    <!-- URL 输入框（可手动填写） -->
    <el-input
      :model-value="modelValue"
      placeholder="或直接输入图片 URL"
      style="margin-top:6px"
      clearable
      @update:model-value="emit('update:modelValue', $event)"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus, Loading } from '@element-plus/icons-vue'
import { uploadImage } from '../api/upload'

defineProps<{ modelValue: string }>()
const emit = defineEmits<{ (e: 'update:modelValue', v: string): void }>()

const inputRef = ref<HTMLInputElement>()
const uploading = ref(false)

function triggerSelect() {
  inputRef.value?.click()
}

async function handleFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  // 重置 input，否则同一文件第二次选不触发 change
  ;(e.target as HTMLInputElement).value = ''

  const MAX = 10 * 1024 * 1024
  if (file.size > MAX) {
    ElMessage.error('图片大小不能超过 10 MB')
    return
  }

  uploading.value = true
  try {
    const res = await uploadImage(file)
    emit('update:modelValue', res.data.url)
  } catch {
    ElMessage.error('上传失败，请重试')
  } finally {
    uploading.value = false
  }
}
</script>

<style scoped>
.image-uploader {
  display: inline-flex;
  flex-direction: column;
  width: 100%;
}

.uploader-box {
  position: relative;
  width: 120px;
  height: 120px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.2s;
}

.uploader-box:hover {
  border-color: #409eff;
}

.uploader-box.has-image {
  border-style: solid;
}

.preview-img {
  width: 100%;
  height: 100%;
}

.placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  color: #909399;
  font-size: 12px;
}

.uploading-mask {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
