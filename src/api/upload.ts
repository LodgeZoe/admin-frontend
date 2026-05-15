import http from './http'

export interface UploadResp {
  url: string
}

/**
 * 上传图片到服务器本地存储
 * @param file 图片文件对象
 * @returns 可访问的图片 URL
 */
export function uploadImage(file: File) {
  const form = new FormData()
  form.append('file', file)
  return http.post<UploadResp>('/api/v1/admin/upload/image', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}
