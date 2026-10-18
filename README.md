# Nexus Office AI v4 — Cozy Isometric Studio

## Yang baru
- Layout desktop horizontal: studio 3D di kiri, panel tim/AI di kanan. Responsif untuk layar HP.
- Palet lebih hidup dan tetap wajar: cream, kayu, teal, biru, lavender, coral.
- Dua lantai yang benar-benar ditumpuk dan terlihat dari kamera isometrik, plus area produksi/arsip di sisi kanan.
- Enam agen dengan model manusia stylized, label nama, seleksi karakter, filter lantai.
- Pergerakan animasi saat task dimulai (prototype visual).
- Endpoint backend Gemini untuk hasil AI berbasis brief; API key hanya disimpan di server.

## Cara menjalankan di komputer/laptop
1. Install Node.js versi LTS.
2. Ekstrak folder proyek.
3. Salin `.env.example` menjadi `.env`, lalu isi `GEMINI_API_KEY` dari Google AI Studio.
4. Jalankan `npm install` lalu `npm start`.
5. Buka `http://localhost:3000`.

## Penting untuk pengguna HP saja
HTML ini bisa dibuka sebagai demo melalui editor HTML online, tetapi endpoint `/api/meeting` tidak akan hidup di CodePen saja. Untuk AI sungguhan, backend Node harus dijalankan di layanan hosting yang mendukung server-side environment variables. Jangan menaruh API key ke dalam HTML/JavaScript publik.

## Batasan prototype
Gerakan karakter sekarang adalah animasi menuju posisi meja/posisi tugas yang sudah ditentukan, belum pathfinding atau simulasi AI otonom penuh. Backend mengirim brief ke satu model Gemini untuk menyusun rencana dan hasil; enam karakter belum menjadi enam proses AI terpisah. Tahap berikutnya adalah tool-use, penyimpanan tugas, dan agen yang dapat menghasilkan file sungguhan dengan persetujuan pengguna.
