# Yukchi web

Nuxt 3 sayt versiyasi: bosh sahifa, yuk boardi, yo'nalishlar va valyuta kurslari. Interfeys o'zbek / rus / ingliz tillarida.

```bash
npm install
npm run dev      # http://localhost:3000
npm run generate # statik build -> .output/public
```

## Vercel

`vercel.json` statik build'ni (`nuxt generate`) `.output/public` dan chiqaradi. Statik host'da `/api/*` mock route'lar ishlamaydi, shuning uchun `NUXT_PUBLIC_DEMO_MODE=true` kirish sahifasini demo bildirishnomasiga almashtiradi. Lokal dev'da mock API ishlaydi — bu o'zgaruvchini o'chirib qo'ying.
