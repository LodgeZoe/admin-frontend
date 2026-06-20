import http from './http'

export interface UploadResp {
  url: string
  key?: string
}

export function uploadImage(file: File) {
  const formData = new FormData()
  formData.append('file', file)
  // 后端返回 { url, key }，http 封装后返回 { data: { url, key } }
  return http.post<UploadResp>('/api/v1/admin/upload/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
