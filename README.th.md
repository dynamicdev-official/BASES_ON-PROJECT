# bases_on — Database Dashboard by dynamicdev_

ยินดีต้อนรับสู่ **bases_on** ระบบจัดการฐานข้อมูลระดับ Professional ที่ได้รับการปรับจูนและรีแบรนด์จาก pgAdmin 4 เพื่อให้สอดคล้องกับมาตรฐานความสวยงามและประสิทธิภาพของ `dynamicdev_ Standrad`.

## ✨ จุดเด่น (Key Highlights)
- **โฉมใหม่ (New Aesthetic):** มาพร้อมดีไซน์โทนสีแดงเข้ม (Crimson Red) ตัดกับพื้นหลัง Dark Mode ที่ดูพรีเมียมและสวยงามกว่าเดิม
- **เบาและเร็ว (Lightweight & Fast):** ตัดไฟล์เอกสาร, ภาษาที่ไม่ใช้, และสคริปต์ตัวแปรที่ไม่จำเป็นออกเพื่อให้ประหยัดทรัพยากรบนเครื่องที่คอมพิวเตอร์สเปกจำกัด
- **ความปลอดภัย (Hardened Security):** ยกระดับการตั้งค่าความปลอดภัยให้เก็บข้อมูลสำคัญไว้ใน `.env` ทั้งหมด เพื่อความเป็นส่วนตัวและความมั่นคงของระบบ
- **แบรนด์ของตัวเอง (Custom Branding):** ลบชื่อ pgAdmin และโลโก้ช้างทุกจุดออก เปลี่ยนเป็น **bases_on** และโลโก้สไตล์ dynamicdev_ ทั้งหน้า Login, Navbar และ Dashboard

## 🚀 เริ่มต้นใช้งาน (Getting Started)

1.  **คัดลอกโปรเจกต์ (Clone Repo)** ลงในคอมพิวเตอร์ของคุณ
2.  **ตั้งค่าตัวแปรสภาพแวดล้อม (Environment Variables):**
    *   สร้างไฟล์ `.env` จากตัวอย่าง `.env.example`
    *   กำหนดค่าใน `.env` ตามต้องการ (เช่น อีเมลและรหัสผ่านเริ่มต้น)
3.  **รันระบบด้วย Docker (Build & Run):**
    ```bash
    docker compose up -d --build
    ```

## 🔒 ข้อมูลล็อกอินเริ่มต้น (Default Credentials)
- **อีเมล (Email):** `bases_on@dynamicdev.asia`
- **รหัสผ่าน (Password):** `changeme`

## 📂 โครงสร้างโปรเจกต์ (Project Structure)
- `web/` — ซอร์สโค้ดของแอปพลิเคชันหลัก (React/Python)
- `Dockerfile` — ตัวกำหนดการสร้างอิมเมจ (Alpine-based, Pure Python Psycopg3)
- `docker-compose.yml` — การกำหนดค่าคอนเทนเนอร์สำหรับรันระบบ
- `.env.example` — ตัวอย่างการตั้งค่าสภาพแวดล้อม (ภาษาไทย)

## ⚖️ ลิขสิทธิ์ (Legal)
Copyright © 2024 - 2026 dynamicdev_ | BASES_ON PROJECT. สงวนลิขสิทธิ์ความสวยงามและประสิทธิภาพโดย dynamicdev_
