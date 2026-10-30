# Quy tắc làm việc cho dự án nguyen-phat-fe

## Quản lý mã nguồn (Git Commit & Push tự động)
- Sau mỗi lần hoàn tất chỉnh sửa mã nguồn hoặc giao diện trong dự án `nguyen-phat-fe`, **luôn tự động thực hiện `git add`, `git commit` và `git push`** lên nhánh hiện tại của remote repository mà không cần đợi người dùng nhắc lại.
- Luôn đảm bảo thông tin tác giả commit (Git author) được cấu hình chính xác như sau trước khi commit:
  - **Username (`user.name`):** `NhanNguyen8080`
  - **Email (`user.email`):** `boiboii162122@gmail.com`
- Trên môi trường Windows PowerShell của máy này, khi cần chạy lệnh `npm` (như `npm.cmd run build` để kiểm tra lỗi trước khi commit), sử dụng `npm.cmd` để tránh lỗi ExecutionPolicy với `npm.ps1`.
