# 📋 Kế Hoạch Triển Khai Trang Xem Trước Thanh Toán (Order Preview)

## 🎯 Mục Tiêu
Tạo trang xem trước đơn hàng trước khi thanh toán với các chức năng:
1. Xem lại giá tiền đơn hàng
2. Quản lý địa chỉ giao hàng
3. Nhập voucher code
4. Chọn phương thức giao hàng
5. Gọi API preview và chuyển sang thanh toán

---

## 📊 Cấu Trúc Dữ Liệu

### 1. Request Body (POST /api/orders/preview)
```json
{
  "items": [
    {
      "productId": 12,
      "sizeId": 2,
      "quantity": 1,
      "toppingIds": [1, 2],
      "iceOptionId": 1,
      "notes": "Ít đá, bỏ riêng"
    }
  ],
  "addressId": 2,
  "voucherCode": "SAVE10",
  "deliveryMethod": "DELIVERY"
}
```

### 2. Response từ API Preview (GET /api/orders/preview)
```json
{
  "success": true,
  "message": "Preview giá thành công",
  "data": {
    "subtotal": 135000,
    "tax": 0,
    "shippingFee": 0,
    "discount": 13500,
    "voucherCode": "SAVE10",
    "totalAmount": 121500,
    "items": [
      {
        "productId": 12,
        "productName": "Trà Sữa Oolong Nướng Sương Sáo",
        "sizeName": "M",
        "quantity": 1,
        "price": 55000,
        "sizePrice": 5000,
        "toppingNames": "Chân trâu đen, Chân hoàng kim",
        "toppingPrice": 10000,
        "iceOptionName": "Ít đá",
        "notes": "Ít đá, bỏ riêng",
        "subtotal": 70000
      }
    ]
  }
}
```

### 3. Response từ API Addresses (GET /addresses)
```json
{
  "success": true,
  "message": "Lấy danh sách địa chỉ thành công",
  "data": [
    {
      "id": 4,
      "fullName": "Thịnh Online",
      "phone": "123135423",
      "district": "Huyện Hóc Môn",
      "city": "TP.HCM",
      "fullAddress": "Xã Xuân Thới Đông, Huyện Hóc Môn, TP.HCM",
      "isDefault": true,
      "createdAt": "2025-11-27T09:50:28"
    }
  ]
}
```

---

## 🔄 Luồng Hoạt Động

### Phase 1: Từ Trang Chi Tiết → OrderPreview
1. User chọn sản phẩm (size, topping, đá, số lượng)
2. Lưu vào store/state:
   - `productId`, `sizeId`, `quantity`, `toppingIds[]`, `iceOptionId`, `notes`
3. Nhấn "Tiếp Tục" → Chuyển sang OrderPreview

### Phase 2: Trang OrderPreview
**Layout:**
- Header: Tiêu đề + Nút quay lại
- Section 1: Địa chỉ giao hàng
- Section 2: Danh sách sản phẩm
- Section 3: Nhập voucher
- Section 4: Phương thức giao hàng
- Section 5: Tóm tắt đơn hàng
- Footer: Nút "Xác Nhận & Thanh Toán"

**Chi tiết từng section:**

#### Section 1 - Địa Chỉ Giao Hàng
- Load API: `GET http://localhost:3000/addresses` (có header Authorization)
- Hiển thị địa chỉ mặc định (isDefault: true)
- Nút "Thay Đổi" → Mở modal chọn địa chỉ từ danh sách
- Nút "Thêm Địa Chỉ" (để sau - chuyển sang form thêm)
- Lưu `addressId` khi chọn

#### Section 2 - Danh Sách Sản Phẩm
- Hiển thị từ items được lưu
- Mỗi item hiển thị:
  - Hình ảnh sản phẩm
  - Tên sản phẩm
  - Size, Topping, Đá
  - Số lượng
  - Giá từng item
- Tính toán: Tạm tính (subtotal)

#### Section 3 - Voucher
- Textbox nhập voucher code
- Nếu không nhập → để rỗng
- (API validate voucher để sau)

#### Section 4 - Phương Thức Giao Hàng
- Radio button: DELIVERY (mặc định)
- Có thể mở rộng sau

#### Section 5 - Tóm Tắt Đơn Hàng
- Tạm tính (subtotal)
- Phí vận chuyển (shippingFee)
- Giảm giá (discount)
- **Tổng cộng (totalAmount)**

### Phase 3: Xác Nhận & Thanh Toán
1. Nhấn nút "Xác Nhận & Thanh Toán"
2. Gọi API: `POST http://localhost:3000/api/orders/preview`
   - Body: request.json structure
   - Header: `Authorization: Bearer {token}`
3. Nhận response với giá cuối cùng
4. Chuyển sang trang Checkout (hiện tại)

---

## 🛠️ Công Việc Chi Tiết

### ✅ Phase 1: Chuẩn Bị
- [x] Đọc cấu trúc API từ demo files
- [x] Xác nhận token lưu ở authStore
- [x] Tạo OrderPreview.vue component

### ✅ Phase 2: Phát Triển Component
- [x] Tạo OrderPreview.vue với layout
- [x] Implement Section 1 (Địa chỉ)
  - [x] Load API addresses
  - [x] Hiển thị địa chỉ mặc định
  - [x] Modal chọn địa chỉ
- [x] Implement Section 2 (Danh sách sản phẩm)
- [x] Implement Section 3 (Voucher)
- [x] Implement Section 4 (Phương thức giao hàng)
- [x] Implement Section 5 (Tóm tắt)
- [x] Implement nút "Xác Nhận & Thanh Toán"

### ✅ Phase 3: API Integration
- [x] Gọi API preview trước khi thanh toán
- [x] Xử lý response và hiển thị giá cuối cùng
- [x] Chuyển hướng sang Checkout

### ✅ Phase 4: UI/UX
- [x] Styling responsive
- [x] Loading states
- [x] Error handling
- [x] Toast notifications

---

## 📝 Những Gì Đã Hoàn Thành

### 1. Component OrderPreview.vue
- ✅ Tạo tại: `src/components/OrderPreview.vue`
- ✅ Bao gồm 5 sections chính
- ✅ Responsive design
- ✅ Modal chọn địa chỉ

### 2. Router Configuration
- ✅ Thêm route `/order-preview` vào `src/router/index.js`
- ✅ Bắt buộc đăng nhập (requiresAuth: true)

### 3. CartModal Update
- ✅ Cập nhật nút "Thanh toán" để chuyển sang `/order-preview` thay vì `/checkout`
- ✅ Cập nhật returnUrl khi chưa đăng nhập

### 4. OrderStore
- ✅ Tạo `src/stores/orderStore.js`
- ✅ Lưu preview data, selected address, voucher code, delivery method
- ✅ Sẵn sàng để Checkout component sử dụng

### 5. API Integration
- ✅ Load addresses từ `http://localhost:3000/addresses`
- ✅ Gọi API preview: `POST http://localhost:3000/api/orders/preview`
- ✅ Lưu response data vào orderStore trước khi chuyển sang Checkout

---

## 🚀 Tiếp Theo (Để Sau)
- [ ] Cập nhật Checkout.vue để sử dụng orderStore data
- [ ] Implement API validate voucher
- [ ] Implement API thêm địa chỉ mới
- [ ] Thêm toast notifications
- [ ] Thêm loading skeleton screens

---

## 📝 Ghi Chú
- Token lấy từ authStore sau khi login
- addressId mặc định là địa chỉ có `isDefault: true`
- voucherCode để rỗng nếu user không nhập
- deliveryMethod mặc định là "DELIVERY"
- toppingIds là mảng, có thể có nhiều topping
