# 📸 Smart Check-In App - Misi 13: Native Power App

**Smart Check-In App** adalah aplikasi absensi digital modern berbasis mobile yang dirancang menggunakan React Native dan Expo SDK. Aplikasi ini berfungsi sebagai sistem pencatatan kehadiran mandiri (*self-check-in*) yang aman dan akurat untuk keperluan perkuliahan atau perkantoran. Dengan memanfaatkan fitur *native* perangkat keras (*hardware*), aplikasi ini mengombinasikan verifikasi wajah via foto *selfie* dan validasi lokasi presisi berbasis GPS (Geolokasi) secara *real-time* sebelum data disimpan secara permanen di memori lokal.

---

## 👨‍💻 Identitas Pengembang
* **Nama:** Sache Deep Singh
* **NIM:** 243303621202
* **Program Studi:** Sistem Informasi

---

## 🛠️ Tech Stack & Dependencies

* **Core Framework:** React Native & Expo SDK (Lintas Platform Android/iOS)
* **Routing & Struktur:** Expo Router (File-based navigation)
* **State Management:** React Hooks (`useState`, `useEffect`, `useRef`)
* **Penyimpanan Lokal:** `AsyncStorage` untuk persistensi data absensi
* **Arsitektur Antarmuka:** Flexbox Layout dengan tema desain *Luxury Dark Palette* (Latar belakang Deep Charcoal `#1A1A24` & Aksen Elegan Gold `#D4AF37`)
* **Expo Native Modules:**
    * `expo-camera` (Mengakses sensor kamera depan untuk foto selfie)
    * `expo-location` (Mengakses sensor GPS untuk mengambil koordinat presisi)
    * `expo-linking` (Deep Linking untuk menjembatani navigasi ke sistem pengaturan HP)

---

## 📋 Daftar Fitur Aplikasi (Pemetaan Kriteria)

Aplikasi ini dibangun dengan memenuhi seluruh standarisasi penilaian fungsionalitas hardware:

### 🟢 Level 1 — Fitur Wajib (Core)
* **Native Permission Flow:** Sistem interseptor otomatis yang memeriksa dan meminta izin akses kamera dan lokasi sebelum fitur dijalankan (`status === 'granted'`).
* **Graceful Request Failure:** Penanganan penolakan izin yang aman menggunakan dialog ringkas (`Alert`) untuk mengedukasi pengguna tanpa membuat aplikasi mengalami *crash*.
* **Image Asset Resolver:** Sistem penangkap gambar yang aman dengan memvalidasi kondisi `result.canceled === false` sebelum merender *URI* aset foto ke komponen `<Image />`.
* **GPS Data Extractor:** Mengambil data koordinat nyata garis lintang (*latitude*) dan garis bujur (*longitude*) langsung dari sensor internal ponsel.

### 🟡 Level 2 — Pengembangan (Fitur Tambahan Proyek)
* **[Level 2] Kamera + Lokasi (Unified Check-In Bundle):** Menggabungkan dokumentasi foto *selfie* kehadiran dan koordinat geografis tempat pengguna berada ke dalam satu kesatuan objek data absensi saat tombol check-in ditekan.
* **[Level 2] Persistensi Data (AsyncStorage):** Menyimpan histori data check-in secara permanen ke dalam memori lokal ponsel, sehingga data kehadiran tidak hilang dan otomatis termuat kembali (*auto-load*) saat aplikasi dibuka ulang.
* **[Level 2] Tombol Settings (Deep Linking Access):** Menyediakan tombol darurat *"Buka Pengaturan"* yang memanfaatkan fungsi `Linking.openSettings()` ketika pengguna tidak sengaja menolak izin secara permanen.
* **[Level 2] Buka di Maps:** Integrasi tombol shortcut yang memanfaatkan URL skema eksternal untuk membuka titik koordinat tempat check-in pengguna secara visual langsung di aplikasi Google Maps / Apple Maps.

---

## 📱 Dokumentasi Antarmuka 




https://github.com/user-attachments/assets/e5b09201-7e2f-408c-bb80-86c25519f92f






---

## 🚀 Cara Menjalankan Proyek secara Lokal

Ikuti panduan berikut untuk menjalankan repositori ini di komputer lokal Anda:

### 1. snack expo https://snack.expo.dev/@sache/fascinated-red-bananas

