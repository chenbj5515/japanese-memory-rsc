if(!self.define){let e,a={};const s=(s,i)=>(s=new URL(s+".js",i).href,a[s]||new Promise((a=>{if("document"in self){const e=document.createElement("script");e.src=s,e.onload=a,document.head.appendChild(e)}else e=s,importScripts(s),a()})).then((()=>{let e=a[s];if(!e)throw new Error(`Module ${s} didn’t register its module`);return e})));self.define=(i,c)=>{const n=e||("document"in self?document.currentScript.src:"")||location.href;if(a[n])return;let t={};const r=e=>s(e,n),o={module:{uri:n},exports:t,require:r};a[n]=Promise.all(i.map((e=>o[e]||r(e)))).then((e=>(c(...e),t)))}}define(["./workbox-4754cb34"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/app-build-manifest.json",revision:"37e7c236b6a6b4d52d28e5f99fb4dead"},{url:"/_next/static/chunks/0e5ce63c-837f2acf4295b25c.js",revision:"gVaA9_jIoMzZiZwJSWTp3"},{url:"/_next/static/chunks/0e5ce63c-837f2acf4295b25c.js.map",revision:"3062cdf89dfd6c503502c14430a2d5aa"},{url:"/_next/static/chunks/103-66b1ac27dadd03ba.js",revision:"gVaA9_jIoMzZiZwJSWTp3"},{url:"/_next/static/chunks/103-66b1ac27dadd03ba.js.map",revision:"25a879b8f5558cb0ead1180a5044e3c1"},{url:"/_next/static/chunks/110-278259a10b8c05cf.js",revision:"gVaA9_jIoMzZiZwJSWTp3"},{url:"/_next/static/chunks/110-278259a10b8c05cf.js.map",revision:"6907e163261bb5e43901359a839997db"},{url:"/_next/static/chunks/417-f2e26494320bd1a2.js",revision:"gVaA9_jIoMzZiZwJSWTp3"},{url:"/_next/static/chunks/417-f2e26494320bd1a2.js.map",revision:"bfb6bdbc68b0bdf5ee5ed73765ce43dc"},{url:"/_next/static/chunks/489-ec54cb53ff8ed5af.js",revision:"gVaA9_jIoMzZiZwJSWTp3"},{url:"/_next/static/chunks/489-ec54cb53ff8ed5af.js.map",revision:"1217b758fce235fdf9aaeff2eeb6ea9a"},{url:"/_next/static/chunks/4bd1b696-8231bb9058488ad8.js",revision:"gVaA9_jIoMzZiZwJSWTp3"},{url:"/_next/static/chunks/4bd1b696-8231bb9058488ad8.js.map",revision:"c03221392b43ea8b3eee4e5b82491c34"},{url:"/_next/static/chunks/52774a7f-36c9d9090c331819.js",revision:"gVaA9_jIoMzZiZwJSWTp3"},{url:"/_next/static/chunks/52774a7f-36c9d9090c331819.js.map",revision:"ea3d64fb5e0b6934434ddf31b2a987d4"},{url:"/_next/static/chunks/600-0728bbe558ad9bac.js",revision:"gVaA9_jIoMzZiZwJSWTp3"},{url:"/_next/static/chunks/600-0728bbe558ad9bac.js.map",revision:"bb14a121e17d43f329912aafa578096d"},{url:"/_next/static/chunks/743-9ee0871d688408c0.js",revision:"gVaA9_jIoMzZiZwJSWTp3"},{url:"/_next/static/chunks/743-9ee0871d688408c0.js.map",revision:"76dcaa2f9b5b117be83afb04312f589e"},{url:"/_next/static/chunks/807-de6fff5b4dadb3e3.js",revision:"gVaA9_jIoMzZiZwJSWTp3"},{url:"/_next/static/chunks/807-de6fff5b4dadb3e3.js.map",revision:"f0e134358fdd436f70bda76ebcc367ca"},{url:"/_next/static/chunks/808-dce9012dbb61c287.js",revision:"gVaA9_jIoMzZiZwJSWTp3"},{url:"/_next/static/chunks/808-dce9012dbb61c287.js.map",revision:"c603ae83ec6ed2a2881e74fdd1836f03"},{url:"/_next/static/chunks/81-1e67dbb15b322e97.js",revision:"gVaA9_jIoMzZiZwJSWTp3"},{url:"/_next/static/chunks/81-1e67dbb15b322e97.js.map",revision:"5fb3c6ee63f5037ca19a548259e5896c"},{url:"/_next/static/chunks/884-7fe89ef418b7922f.js",revision:"gVaA9_jIoMzZiZwJSWTp3"},{url:"/_next/static/chunks/884-7fe89ef418b7922f.js.map",revision:"8f576de95cf86e919bc4914918d1ba64"},{url:"/_next/static/chunks/986-ac1b09f093eb9923.js",revision:"gVaA9_jIoMzZiZwJSWTp3"},{url:"/_next/static/chunks/986-ac1b09f093eb9923.js.map",revision:"94c8e01a661a3256c0e79b7a6bbcf1e4"},{url:"/_next/static/chunks/app/_not-found/page-c7da39ff086db8ce.js",revision:"gVaA9_jIoMzZiZwJSWTp3"},{url:"/_next/static/chunks/app/_not-found/page-c7da39ff086db8ce.js.map",revision:"32a04c545b31ab513dddcb5c872aec55"},{url:"/_next/static/chunks/app/api/auth/%5B...nextauth%5D/route-a032d86ed27a609b.js",revision:"gVaA9_jIoMzZiZwJSWTp3"},{url:"/_next/static/chunks/app/api/sentry-example-api/route-e5d94d0f1d35a876.js",revision:"gVaA9_jIoMzZiZwJSWTp3"},{url:"/_next/static/chunks/app/exam-preparation/page-c2f856bc78bc2510.js",revision:"gVaA9_jIoMzZiZwJSWTp3"},{url:"/_next/static/chunks/app/exam-preparation/page-c2f856bc78bc2510.js.map",revision:"bca4e68ead374eba789e5de06bc09634"},{url:"/_next/static/chunks/app/exam/page-26f9411f956d86a3.js",revision:"gVaA9_jIoMzZiZwJSWTp3"},{url:"/_next/static/chunks/app/exam/page-26f9411f956d86a3.js.map",revision:"4a34f088bf410ca6072585cdbbfd9678"},{url:"/_next/static/chunks/app/global-error-19292ff51fe05cc8.js",revision:"gVaA9_jIoMzZiZwJSWTp3"},{url:"/_next/static/chunks/app/global-error-19292ff51fe05cc8.js.map",revision:"ceef23686e6dcce57e62e8cd0f789942"},{url:"/_next/static/chunks/app/latest/page-7401857f6a46182f.js",revision:"gVaA9_jIoMzZiZwJSWTp3"},{url:"/_next/static/chunks/app/latest/page-7401857f6a46182f.js.map",revision:"f4ef74e8b8a5408adcab0158c0555a98"},{url:"/_next/static/chunks/app/layout-00c7f524e870809c.js",revision:"gVaA9_jIoMzZiZwJSWTp3"},{url:"/_next/static/chunks/app/layout-00c7f524e870809c.js.map",revision:"38516f7ccd886817b70ad89c8ad9cc7d"},{url:"/_next/static/chunks/app/loading-445f2078880c6d4f.js",revision:"gVaA9_jIoMzZiZwJSWTp3"},{url:"/_next/static/chunks/app/random/page-202512f840cba4ca.js",revision:"gVaA9_jIoMzZiZwJSWTp3"},{url:"/_next/static/chunks/app/random/page-202512f840cba4ca.js.map",revision:"f990d6488f952a9249b38aee93539174"},{url:"/_next/static/chunks/app/translation/page-282a06c32e9019e1.js",revision:"gVaA9_jIoMzZiZwJSWTp3"},{url:"/_next/static/chunks/app/translation/page-282a06c32e9019e1.js.map",revision:"cd94fdd1066acef09dc19c4e7221903b"},{url:"/_next/static/chunks/app/word-cards/page-3cf107b9c7e3c9d0.js",revision:"gVaA9_jIoMzZiZwJSWTp3"},{url:"/_next/static/chunks/app/word-cards/page-3cf107b9c7e3c9d0.js.map",revision:"ed929c8e8459952dd4eaf8f09a6b0ef5"},{url:"/_next/static/chunks/framework-d4fe9202d25e6211.js",revision:"gVaA9_jIoMzZiZwJSWTp3"},{url:"/_next/static/chunks/framework-d4fe9202d25e6211.js.map",revision:"8cb278279f8a5c0495bff0e7e45c1015"},{url:"/_next/static/chunks/main-app-40e856ab0909908c.js",revision:"gVaA9_jIoMzZiZwJSWTp3"},{url:"/_next/static/chunks/main-app-40e856ab0909908c.js.map",revision:"a90bcb414feeec110ce394f7411eab2b"},{url:"/_next/static/chunks/main-fbf7e281de1ef575.js",revision:"gVaA9_jIoMzZiZwJSWTp3"},{url:"/_next/static/chunks/main-fbf7e281de1ef575.js.map",revision:"4663084907f76f44818f6365d426b28e"},{url:"/_next/static/chunks/pages/_app-2676985bd9f32848.js",revision:"gVaA9_jIoMzZiZwJSWTp3"},{url:"/_next/static/chunks/pages/_app-2676985bd9f32848.js.map",revision:"5164b977c12647182360e56f6548c2c0"},{url:"/_next/static/chunks/pages/_error-f907e58eeb1e5b29.js",revision:"gVaA9_jIoMzZiZwJSWTp3"},{url:"/_next/static/chunks/pages/_error-f907e58eeb1e5b29.js.map",revision:"493a130a9ec45bf9b03a7fb647563918"},{url:"/_next/static/chunks/polyfills-42372ed130431b0a.js",revision:"846118c33b2c0e922d7b3a7676f81f6f"},{url:"/_next/static/chunks/webpack-7ae8838aca4016f5.js",revision:"gVaA9_jIoMzZiZwJSWTp3"},{url:"/_next/static/chunks/webpack-7ae8838aca4016f5.js.map",revision:"78278972fe4ee92a8744f8ba4ab49ee5"},{url:"/_next/static/css/9db67ae5b3ea37e0.css",revision:"9db67ae5b3ea37e0"},{url:"/_next/static/css/9db67ae5b3ea37e0.css.map",revision:"39e3c06f47f5851677ab8236962325a6"},{url:"/_next/static/css/b9c14d222309bf8f.css",revision:"b9c14d222309bf8f"},{url:"/_next/static/css/b9c14d222309bf8f.css.map",revision:"0f63c201644c5c917b3556e3e1ecd001"},{url:"/_next/static/gVaA9_jIoMzZiZwJSWTp3/_buildManifest.js",revision:"0483d8f8a8804261665840b10c10dd1b"},{url:"/_next/static/gVaA9_jIoMzZiZwJSWTp3/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/_next/static/media/4473ecc91f70f139-s.p.woff",revision:"78e6fc13ea317b55ab0bd6dc4849c110"},{url:"/_next/static/media/463dafcda517f24f-s.p.woff",revision:"cbeb6d2d96eaa268b4b5beb0b46d9632"},{url:"/_next/static/media/newyork.e1fd1a72.otf",revision:"e1fd1a72"},{url:"/_next/static/media/remixicon.1cb14d6c.ttf",revision:"1cb14d6c"},{url:"/_next/static/media/remixicon.8929296a.woff2",revision:"8929296a"},{url:"/_next/static/media/remixicon.ad5da63d.woff",revision:"ad5da63d"},{url:"/_next/static/media/remixicon.c7992d9d.eot",revision:"c7992d9d"},{url:"/assets/fonts/newyork.otf",revision:"017b0a8284ffe0738439f054ada23134"},{url:"/assets/profiles/01.png",revision:"03d74c93b244c53046d849902108c979"},{url:"/assets/profiles/02.png",revision:"e904d5847af14af9cad1ad5c92151406"},{url:"/assets/profiles/03.png",revision:"5b8bbc5e558477202ca57eafc42882d0"},{url:"/assets/profiles/04.png",revision:"9ad03363f40c8f1619db8c7cafe81bcb"},{url:"/assets/profiles/05.png",revision:"d655aa880718d303bb57235acc1ac516"},{url:"/favicon.ico",revision:"c30c7d42707a47a3f4591831641e50dc"},{url:"/icon/icon.png",revision:"1d46fa08e06b37a5888f92c2fe4ec699"},{url:"/lines.png",revision:"89b655725b64e7b7d83b34e70159f772"},{url:"/manifest.json",revision:"e76d639166f2717bb2bac350a3778b34"},{url:"/next.svg",revision:"8e061864f388b47f33a1c3780831193e"},{url:"/vercel.svg",revision:"61c6b19abff40ea7acd577be818f3976"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:a,event:s,state:i})=>a&&"opaqueredirect"===a.type?new Response(a.body,{status:200,statusText:"OK",headers:a.headers}):a}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const a=e.pathname;return!a.startsWith("/api/auth/")&&!!a.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
//# sourceMappingURL=sw.js.map
