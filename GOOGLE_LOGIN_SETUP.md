# Google Login Setup Guide

## Tổng quan
Tính năng đăng nhập Google đã được thêm vào ứng dụng. Để sử dụng, bạn cần cấu hình Google OAuth 2.0.

## Các bước cấu hình

### 1. Tạo Google OAuth 2.0 Credentials
1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo một dự án mới hoặc chọn dự án hiện có
3. Vào **APIs & Services** > **Credentials**
4. Nhấp **Create Credentials** > **OAuth 2.0 Client IDs**
5. Chọn **Web application**
6. Thêm các URI được phép:
   - **Authorized JavaScript origins**: `http://localhost:8080` (cho development)
   - **Authorized redirect URIs**: `http://localhost:8080/` (cho development)
7. Sao chép **Client ID**

### 2. Cấu hình biến môi trường
1. Tạo file `.env.local` trong thư mục gốc của project (nếu chưa có)
2. Thêm dòng sau:
   ```
   VUE_APP_GOOGLE_CLIENT_ID=your_client_id_here
   ```
   Thay `your_client_id_here` bằng Client ID bạn vừa sao chép

### 3. Khởi động ứng dụng
```bash
npm install
npm run serve
```

## Cấu trúc code

### Frontend (Login.vue)
- **Button Google Login**: Hiển thị button Google Sign-In chính thức
- **Callback**: `handleGoogleLogin()` xử lý token từ Google
- **Gửi token**: Gửi Google ID Token lên server

### Backend (authStore.js)
- **Action**: `loginWithGoogle(googleIdToken)`
- **Request**: POST `/auth/google-login` với body:
  ```json
  {
    "token": "GOOGLE_ID_TOKEN_FROM_CLIENT"
  }
  ```
- **Response**: Trả về `accessToken`, `refreshToken`, và `user` info

## API Endpoint

**POST** `/auth/google-login`

Request body:
```json
{
  "token": "GOOGLE_ID_TOKEN_FROM_CLIENT"
}
```

Response (Success):
```json
{
  "data": {
    "accessToken": "...",
    "refreshToken": "...",
    "user": {
      "id": "...",
      "email": "...",
      "username": "...",
      "role": "..."
    }
  }
}
```

## Troubleshooting

### Google button không hiển thị
- Kiểm tra Console (F12) xem có lỗi gì
- Đảm bảo Google Sign-In script được load từ `public/index.html`
- Kiểm tra `VUE_APP_GOOGLE_CLIENT_ID` đã được set đúng

### Login thất bại
- Kiểm tra Client ID có đúng không
- Kiểm tra server endpoint `/auth/google-login` có hoạt động không
- Xem console browser để xem chi tiết lỗi

### CORS issues
- Đảm bảo server cho phép requests từ `http://localhost:8080`
- Thêm CORS headers nếu cần

## Tính năng

✅ Google Sign-In button với icon chính thức  
✅ Tự động redirect sau khi login thành công  
✅ Lưu tokens và user info vào localStorage  
✅ Error handling và loading states  
✅ Tích hợp với existing auth store  
