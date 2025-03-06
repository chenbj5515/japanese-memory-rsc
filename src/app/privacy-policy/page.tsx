// 'use client'
// import { useLanguage } from "@/i18n/language-context"

// export default function PrivacyPolicy() {
//   const { t } = useLanguage()

//   return (
//     <div className="min-h-screen bg-white text-[18px] leading-relaxed tracking-[0.4px]">

//       {/* Main Content */}
//       <div className="container mx-auto px-6 py-8 max-w-4xl">
//         <h1 className="text-5xl font-bold mb-6 text-left">{t('privacy.title')}</h1>

//         <h2 className="text-xl mb-2 text-[#5a5959]">{t('privacy.subtitle')}</h2>

//         <p className="text-gray-600 mb-12 text-[#5a5959]">
//           {t('privacy.lastUpdated')} March 1, 2025
//         </p>

//         <div className="space-y-8 text-gray-700">
//           <p>{t('privacy.welcome')}</p>

//           <div className="border-t border-gray-200 pt-8">
//             <p className="font-bold mb-4">{t('privacy.sections.read.title')}</p>
//             <p className="uppercase mb-8 text-gray-800">
//               {t('privacy.sections.read.description')}
//             </p>
//           </div>

//           <div>
//             <h2 className="text-xl font-bold mb-4">{t('privacy.sections.collect.title')}</h2>
//             <p className="mb-4">{t('privacy.sections.collect.description')}</p>
//             <ul className="list-disc pl-6 mb-4 space-y-2">
//               {(t('privacy.sections.collect.items') as string[]).map((item: string, index: number) => (
//                 <li key={index}>{item}</li>
//               ))}
//             </ul>
//           </div>

//           <div>
//             <h2 className="text-xl font-bold mb-4">{t('privacy.sections.how.title')}</h2>
//             <p>{t('privacy.sections.how.description')}</p>
//           </div>

//           <div>
//             <h2 className="text-xl font-bold mb-4">{t('privacy.sections.use.title')}</h2>
//             <p className="mb-4">{t('privacy.sections.use.description')}</p>
//             <ul className="list-disc pl-6 mb-4 space-y-2">
//               {(t('privacy.sections.use.items') as string[]).map((item: string, index: number) => (
//                 <li key={index}>{item}</li>
//               ))}
//             </ul>
//           </div>

//           <div>
//             <h2 className="text-xl font-bold mb-4">{t('privacy.sections.share.title')}</h2>
//             <p>{t('privacy.sections.share.description')}</p>
//           </div>

//           <div>
//             <h2 className="text-xl font-bold mb-4">{t('privacy.sections.storage.title')}</h2>
//             <p>{t('privacy.sections.storage.description')}</p>
//           </div>

//           <div>
//             <h2 className="text-xl font-bold mb-4">{t('privacy.sections.rights.title')}</h2>
//             <p className="mb-4">{t('privacy.sections.rights.description')}</p>
//             <ul className="list-disc pl-6 mb-4 space-y-2">
//               {(t('privacy.sections.rights.items') as string[]).map((item: string, index: number) => (
//                 <li key={index}>{item}</li>
//               ))}
//             </ul>
//             <p>{t('privacy.sections.rights.contact')}</p>
//           </div>

//           <div>
//             <h2 className="text-xl font-bold mb-4">{t('privacy.sections.cookies.title')}</h2>
//             <p>{t('privacy.sections.cookies.description')}</p>
//           </div>

//           <div>
//             <h2 className="text-xl font-bold mb-4">{t('privacy.sections.changes.title')}</h2>
//             <p>{t('privacy.sections.changes.description')}</p>
//           </div>

//           <div>
//             <h2 className="text-xl font-bold mb-4">{t('privacy.sections.contact.title')}</h2>
//             <p>{t('privacy.sections.contact.description')}</p>
//             <p className="mt-2">
//               <a href="mailto:chenbj55150220@gmail.com" className="text-blue-600 hover:underline">
//                 chenbj55150220@gmail.com
//               </a>
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }