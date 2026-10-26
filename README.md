# terasia-website

Website produk Terasia — di-host di `https://ter.asia` (VPS terasia-dev-vps-001,
disajikan oleh Caddy portal stack).

**Stack sengaja minimal**: plain HTML + CSS murni, tanpa build step, tanpa
framework, tanpa dependensi eksternal. File statis di-serve apa adanya.

## Struktur

```
index.html      # landing page satu halaman (dark mode, Bahasa Indonesia)
css/style.css   # seluruh styling
```

## Konten

Copywriting disusun dari dokumentasi produk di repo
`agungw132/terasia-server-configuration` (`docs/01-latar-belakang.md`,
`docs/02-arsitektur-keseluruhan.md`, `docs/07-analitik-dan-chatbot.md`,
`docs/08-observability-alerting.md`, `docs/09-keamanan.md`).
Angka benchmark (query arsip < 1 detik) dari benchmark compaction parquet.

## Deploy

Dilakukan via playbook infra repo (`terasia-server-configuration`) — site block
Caddy untuk `ter.asia` + `www.ter.asia` menampilkan isi direktori website ini.
Jangan edit file langsung di VPS; semua perubahan lewat repo ini + PR.

## Asisten AI "Tera"

Widget asisten AI (Fase 4) akan menambah `tera.js` + endpoint chat di VPS
(LLM via ai.sumopod.com, grounding dari dokumentasi produk Terasia).
