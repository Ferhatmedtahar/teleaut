"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BookOpen, HelpCircle, Mail, MessageCircle, Phone } from "lucide-react";
import Link from "next/link";
import type React from "react";

export default function AidePage() {
  return (
    <main className="min-h-screen bg-background text-gray-800 pb-20">
      {/* Hero Section */}
      <section
        // className="relative overflow-hidden bg-[#0F2C3F] bg-gradient-to-tr from-primary-900 to-primary-700 dark:bg-gradient-to-tr dark:from-primary-900 dark:via-primary-800 dark:to-primary-700 text-white py-12 px-6 shadow-inner"
        className="relative overflow-hidden bg-[#0F2C3F] bg-gradient-to-tr from-[#16222A] to-[#355869] dark:bg-gradient-to-tr dark:from-[#0B111E] dark:via-[#14212E] dark:to-[#1F2F3F] text-white py-12 px-6 shadow-inner"
      >
        <div className="absolute inset-0 bg-primary/5"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/20 to-transparent"></div>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Aide</h1>
          <p className="text-lg sm:text-xl text-primary-50">
            Besoin d&apos;aide ? On est là pour toi !
          </p>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-1/2 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-20 w-32 h-32 bg-primary-300/20 rounded-full blur-2xl"></div>
      </section>

      {/* Quick Help Cards */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 space-y-16">
        <div className="text-center">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary-600 via-primary-900 to-[#355869]  dark:from:primary-200 dark:to-primary-500 dark:via-primary-400  bg-clip-text text-transparent mb-10">
            Comment puis-je t&apos;aider ?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <HelpCard
              title="Trouver des vidéos"
              desc="Utilise la barre de recherche ou navigue par matière et classe"
              icon={<HelpCircle className="w-6 h-6" />}
              gradient="from-primary-600 to-primary-800"
            />
            <HelpCard
              title="Contacter un prof"
              desc="Va sur le profil du prof et clique sur 'Demander une étude'"
              icon={<BookOpen className="w-6 h-6" />}
              gradient="from-primary-500 to-primary-700"
            />
            <HelpCard
              title="Filtrer le contenu"
              desc="Utilise les filtres par classe, filière et matière"
              icon={<MessageCircle className="w-6 h-6" />}
              gradient="from-primary-600 to-primary-900"
            />
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="dark:text-primary-200  text-2xl font-bold text-center mb-6">
            Questions fréquentes
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-primary-600 to-primary-800 rounded-full mx-auto mb-8" />

          <Accordion type="single" collapsible className="space-y-4">
            <FAQ
              question="Comment regarder les vidéos ?"
              answer="Clique simplement sur n'importe quelle vidéo pour la regarder. Tu peux aussi créer une playlist de tes vidéos favorites."
            />
            <FAQ
              question="Comment demander une étude personnalisée ?"
              answer="Va sur le profil du professeur qui t'intéresse, puis clique sur le bouton 'Demander une étude'. Tu pourras expliquer ce dont tu as besoin."
            />
            <FAQ
              question="Les cours suivent-ils le programme tunisien ?"
              answer="Oui ! Tous nos professeurs enseignent selon le programme officiel tunisien, de la 7ème année de base jusqu'au baccalauréat."
            />
            <FAQ
              question="Comment trouver un prof qui explique bien ?"
              answer="Chaque prof a sa méthode. Regarde plusieurs vidéos et choisis celui qui correspond à ton style d'apprentissage."
            />
          </Accordion>
        </div>

        <div className="relative max-w-2xl mx-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-200/30 to-primary-300/30 rounded-3xl blur-xl" />

          <div className="relative bg-white dark:bg-background backdrop-blur-sm p-8 sm:p-12 rounded-3xl   border border-primary-200/50 dark:border-border/90 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-900 rounded-full mb-6 text-white text-2xl shadow-xs">
              💬
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-transparent bg-gradient-to-r from-primary-600 via-primary-900 to-[#355869] bg-clip-text mb-4">
              Vous avez encore besoin d&apos;aide ?
            </h2>

            <p className="text-gray-700 dark:text-gray-100 text-lg mb-6">
              Notre équipe est toujours là pour vous aider. N&apos;hésitez pas à
              nous contacter !
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <ContactButton
                text="Envoyer un email"
                icon={<Mail className="w-5 h-5" />}
                href="mailto:rayensouissi08@gmail.com"
                primary
              />

              <ContactButton
                text="Appeler le support"
                icon={<Phone className="w-5 h-5" />}
                href="tel:+21653222485"
                primary={false}
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function HelpCard({
  title,
  desc,
  icon,
  gradient,
}: {
  title: string;
  desc: string;
  icon: React.ReactNode;
  gradient: string;
}) {
  return (
    <div className=" bg-white dark:bg-background backdrop-blur-sm border border-primary-200/50 dark:border-border/90 rounded-2xl p-6 shadow-lg shadow-gray-900/5 hover:shadow-2xl hover:shadow-primary-900/10 transition-all duration-300 hover:-translate-y-1 group">
      <div
        className={`w-12 h-12 flex items-center justify-center rounded-xl mb-4 text-white shadow-md bg-gradient-to-br ${gradient} group-hover:scale-110 transition-transform duration-300`}
      >
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-100 mb-2 group-hover:text-gray-800 transition-colors">
        {title}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-200 group-hover:text-gray-700 transition-colors">
        {desc}
      </p>
    </div>
  );
}

function FAQ({ question, answer }: { question: string; answer: string }) {
  return (
    <AccordionItem value={question} className="hover:cursor-pointer">
      <AccordionTrigger className="text-left text-gray-800 dark:text-gray-100 font-medium hover:text-primary-700 transition hover:underline-offset-2">
        {question}
      </AccordionTrigger>
      <AccordionContent className="text-gray-600 dark:text-gray-200">
        {answer}
      </AccordionContent>
    </AccordionItem>
  );
}

function ContactButton({
  text,
  icon,
  href,
  primary,
}: {
  text: string;
  icon: React.ReactNode;
  href: string;
  primary: boolean;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition hover:scale-105 ${
        primary
          ? "bg-gradient-to-r from-primary-600 to-primary-800 text-white hover:from-primary-700 hover:to-primary-900"
          : "bg-white dark:bg-background text-gray-700 dark:text-gray-100 border border-gray-300 dark:border-border hover:bg-gray-50 dark:hover:bg-gray-900"
      }`}
    >
      {icon}
      {text}
    </Link>
  );
}

// "use client";

// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "@/components/ui/accordion";
// import { BookOpen, HelpCircle, Mail, MessageCircle, Phone } from "lucide-react";
// import { motion } from "motion/react";
// import Link from "next/link";
// import type React from "react";

// export default function AidePage() {
//   return (
//     <main className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 text-gray-800 pb-20">
//       {/* Hero Section */}
//       <section className="bg-gradient-to-r from-emerald-600 via-teal-700 to-cyan-700 text-white py-12 px-6 shadow-inner relative overflow-hidden">
//         <div className="absolute inset-0 bg-black/10" />
//         <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/30 to-transparent" />
//         <div className="relative z-10 max-w-4xl mx-auto text-center">
//           <h1 className="text-4xl sm:text-5xl font-bold mb-4">Aide</h1>
//           <p className="text-lg sm:text-xl text-emerald-100">
//             Besoin d&apos;aide ? On est là pour toi !
//           </p>
//         </div>
//       </section>

//       {/* Quick Help Cards */}
//       <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 space-y-16">
//         <div className="text-center">
//           <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent mb-10">
//             Comment puis-je t&apos;aider ?
//           </h2>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             <HelpCard
//               title="Trouver des vidéos"
//               desc="Utilise la barre de recherche ou navigue par matière et classe"
//               icon={<HelpCircle className="w-6 h-6" />}
//               gradient="from-blue-500 to-indigo-600"
//             />
//             <HelpCard
//               title="Contacter un prof"
//               desc="Va sur le profil du prof et clique sur 'Demander une étude'"
//               icon={<BookOpen className="w-6 h-6" />}
//               gradient="from-purple-500 to-violet-600"
//             />
//             <HelpCard
//               title="Filtrer le contenu"
//               desc="Utilise les filtres par classe, filière et matière"
//               icon={<MessageCircle className="w-6 h-6" />}
//               gradient="from-emerald-500 to-teal-600"
//             />
//           </div>
//         </div>

//         {/* FAQ Section */}
//         <div className="max-w-3xl mx-auto">
//           <h2 className="text-2xl font-bold text-center mb-6">
//             Questions fréquentes
//           </h2>
//           <div className="w-16 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mx-auto mb-8" />

//           <Accordion type="single" collapsible className="space-y-4">
//             <FAQ
//               question="Comment regarder les vidéos ?"
//               answer="Clique simplement sur n'importe quelle vidéo pour la regarder. Tu peux aussi créer une playlist de tes vidéos favorites."
//             />
//             <FAQ
//               question="Comment demander une étude personnalisée ?"
//               answer="Va sur le profil du professeur qui t'intéresse, puis clique sur le bouton 'Demander une étude'. Tu pourras expliquer ce dont tu as besoin."
//             />
//             <FAQ
//               question="Les cours suivent-ils le programme tunisien ?"
//               answer="Oui ! Tous nos professeurs enseignent selon le programme officiel tunisien, de la 7ème année de base jusqu'au baccalauréat."
//             />
//             <FAQ
//               question="Comment trouver un prof qui explique bien ?"
//               answer="Chaque prof a sa méthode. Regarde plusieurs vidéos et choisis celui qui correspond à ton style d'apprentissage."
//             />
//           </Accordion>
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <motion.div
//             whileHover={{ y: -5 }}
//             className="bg-white border border-blue-100 rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300"
//           >
//             <h3 className="text-xl md:text-2xl font-bold text-blue-700 mb-4 flex items-center">
//               <Mail className="mr-2 h-6 w-6" /> Par email
//             </h3>
//             <p className="text-gray-700 mb-4">
//               Notre équipe de support est disponible par email 7j/7. Nous nous
//               efforçons de répondre à toutes les demandes dans un délai de 24
//               heures.
//             </p>
//             <Link
//               href="mailto:contact@plateforme.tn"
//               className="text-blue-600 font-medium hover:underline flex items-center"
//             >
//               contact@plateforme.tn
//             </Link>
//           </motion.div>

//           <motion.div
//             whileHover={{ y: -5 }}
//             className="bg-white border border-blue-100 rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300"
//           >
//             <h3 className="text-xl md:text-2xl font-bold text-blue-700 mb-4 flex items-center">
//               <Phone className="mr-2 h-6 w-6" /> Par téléphone
//             </h3>
//             <p className="text-gray-700 mb-4">
//               Tu préfères parler à quelqu&apos;un ? Notre service client est
//               disponible du lundi au vendredi, de 9h à 18h.
//             </p>
//             <Link
//               href="tel:+21670123456"
//               className="text-blue-600 font-medium hover:underline flex items-center"
//             >
//               +216 70 123 456
//             </Link>
//           </motion.div>
//         </div>

//         {/* Contact Section */}
//         <div className="relative max-w-2xl mx-auto">
//           <div className="absolute inset-0 bg-gradient-to-r from-emerald-200/50 to-teal-200/50 rounded-3xl blur-2xl" />
//           <div className="relative bg-white/80 backdrop-blur-sm p-8 sm:p-12 rounded-3xl shadow-xl border border-emerald-200/50 text-center">
//             <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full mb-6 text-white text-2xl shadow-md">
//               💬
//             </div>
//             <h2 className="text-2xl sm:text-3xl font-bold text-transparent bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text mb-4">
//               Encore besoin d&apos;aide ?
//             </h2>
//             <p className="text-gray-700 text-lg mb-6">
//               Notre équipe est toujours prête à t&apos;aider. N&apos;hésite pas
//               à nous contacter !
//             </p>
//             <div className="flex flex-col sm:flex-row gap-4 justify-center">
//               <ContactButton
//                 text="Envoyer un email"
//                 icon={<Mail className="w-5 h-5" />}
//                 href="mailto:support@example.com"
//                 primary
//               />
//               <ContactButton
//                 text="Chat en direct"
//                 icon={<MessageCircle className="w-5 h-5" />}
//                 href="#"
//                 primary={false}
//               />
//             </div>
//           </div>
//         </div>
//       </section>
//     </main>
//   );
// }

// function HelpCard({
//   title,
//   desc,
//   icon,
//   gradient,
// }: {
//   title: string;
//   desc: string;
//   icon: React.ReactNode;
//   gradient: string;
// }) {
//   return (
//     <div className="bg-white/90 backdrop-blur-sm border border-white/60 rounded-2xl p-6 shadow hover:shadow-lg transition-all duration-300">
//       <div
//         className={`w-12 h-12 flex items-center justify-center rounded-xl mb-4 text-white shadow-md bg-gradient-to-br ${gradient}`}
//       >
//         {icon}
//       </div>
//       <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
//       <p className="text-sm text-gray-600">{desc}</p>
//     </div>
//   );
// }

// function FAQ({ question, answer }: { question: string; answer: string }) {
//   return (
//     <AccordionItem value={question}>
//       <AccordionTrigger className="text-left text-gray-800 font-medium hover:text-emerald-700 transition">
//         {question}
//       </AccordionTrigger>
//       <AccordionContent className="text-gray-600">{answer}</AccordionContent>
//     </AccordionItem>
//   );
// }

// function ContactButton({
//   text,
//   icon,
//   href,
//   primary,
// }: {
//   text: string;
//   icon: React.ReactNode;
//   href: string;
//   primary: boolean;
// }) {
//   return (
//     <Link
//       href={href}
//       className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition hover:scale-105 ${
//         primary
//           ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700"
//           : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
//       }`}
//     >
//       {icon}
//       {text}
//     </Link>
//   );
// }
// "use client";

// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "@/components/ui/accordion";
// import { BookOpen, HelpCircle, Mail, MessageCircle, Phone } from "lucide-react";
// import { motion } from "motion/react";
// import Link from "next/link";
// import type React from "react";

// export default function AidePage() {
//   return (
//     <main className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 text-gray-800 pb-12">
//       <section className="bg-white border-b border-gray-200 py-8 px-4 md:px-8 shadow-md">
//         <div className="max-w-6xl mx-auto">
//           <h1 className="text-3xl md:text-4xl font-bold text-blue-800">Aide</h1>
//           <p className="mt-2 text-sm md:text-base text-gray-600">
//             Besoin d&apos;assistance ? Nous sommes là pour toi.
//           </p>
//         </div>
//       </section>

//       <section className="max-w-5xl mx-auto px-4 md:px-6 py-12 space-y-16">
//         {/* Intro */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//           className="bg-white shadow-lg rounded-xl p-6 md:p-8 border border-blue-100"
//         >
//           <h2 className="text-2xl md:text-3xl font-bold mb-4 text-blue-700">
//             Comment pouvons-nous t&apos;aider ?
//           </h2>
//           <p className="text-gray-700 mb-4 text-base md:text-lg">
//             Notre équipe est disponible pour répondre à toutes tes questions et
//             t&apos;aider à tirer le meilleur parti de notre plateforme. Que tu
//             aies besoin d&apos;aide pour naviguer sur le site, comprendre
//             comment fonctionnent les cours personnalisés, ou résoudre un
//             problème technique, nous sommes là pour toi.
//           </p>
//         </motion.div>

//         {/* FAQ Section */}
//         <div className="bg-white shadow-lg rounded-xl p-6 md:p-8 border border-blue-100">
//           <h2 className="text-2xl md:text-3xl font-bold mb-6 text-blue-700">
//             Questions fréquentes
//           </h2>

//           <Accordion type="single" collapsible className="w-full">
//             <AccordionItem value="item-1">
//               <AccordionTrigger className="text-base md:text-lg font-medium text-blue-800">
//                 Comment puis-je m&apos;inscrire à un cours ?
//               </AccordionTrigger>
//               <AccordionContent className="text-gray-700 text-base">
//                 Pour t&apos;inscrire à un cours, il te suffit de créer un
//                 compte, puis de naviguer vers la section &quot;Cours&quot; et de
//                 sélectionner la matière qui t&apos;intéresse. Tu pourras ensuite
//                 choisir parmi les différents professeurs disponibles et
//                 t&apos;inscrire au cours de ton choix.
//               </AccordionContent>
//             </AccordionItem>

//             <AccordionItem value="item-2">
//               <AccordionTrigger className="text-base md:text-lg font-medium text-blue-800">
//                 Comment demander un cours personnalisé ?
//               </AccordionTrigger>
//               <AccordionContent className="text-gray-700 text-base">
//                 Pour demander un cours &quot;Étude&quot; personnalisé, rends-toi
//                 sur le profil du professeur de ton choix et clique sur le bouton
//                 &quot;Demander un cours personnalisé&quot;. Tu pourras alors
//                 préciser tes besoins et le professeur te contactera pour
//                 organiser une session adaptée à tes besoins.
//               </AccordionContent>
//             </AccordionItem>

//             <AccordionItem value="item-3">
//               <AccordionTrigger className="text-base md:text-lg font-medium text-blue-800">
//                 Les cours sont-ils disponibles hors ligne ?
//               </AccordionTrigger>
//               <AccordionContent className="text-gray-700 text-base">
//                 Oui, une fois que tu t&apos;es inscrit à un cours, tu peux
//                 télécharger les vidéos pour les visionner hors ligne. Cette
//                 fonctionnalité est disponible sur notre application mobile pour
//                 Android et iOS.
//               </AccordionContent>
//             </AccordionItem>

//             <AccordionItem value="item-4">
//               <AccordionTrigger className="text-base md:text-lg font-medium text-blue-800">
//                 Comment puis-je contacter un professeur ?
//               </AccordionTrigger>
//               <AccordionContent className="text-gray-700 text-base">
//                 Tu peux contacter un professeur directement depuis son profil en
//                 utilisant la fonction de messagerie intégrée. Si tu es déjà
//                 inscrit à l&apos;un de ses cours, tu auras également accès à un
//                 forum de discussion dédié.
//               </AccordionContent>
//             </AccordionItem>

//             <AccordionItem value="item-5">
//               <AccordionTrigger className="text-base md:text-lg font-medium text-blue-800">
//                 Comment signaler un problème technique ?
//               </AccordionTrigger>
//               <AccordionContent className="text-gray-700 text-base">
//                 Si tu rencontres un problème technique, tu peux nous le signaler
//                 en utilisant le formulaire de contact disponible en bas de cette
//                 page, ou en envoyant un email à support@plateforme.tn. Notre
//                 équipe technique te répondra dans les plus brefs délais.
//               </AccordionContent>
//             </AccordionItem>
//           </Accordion>
//         </div>

//         {/* Contact Options */}
// <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//   <motion.div
//     whileHover={{ y: -5 }}
//     className="bg-white border border-blue-100 rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300"
//   >
//     <h3 className="text-xl md:text-2xl font-bold text-blue-700 mb-4 flex items-center">
//       <Mail className="mr-2 h-6 w-6" /> Par email
//     </h3>
//     <p className="text-gray-700 mb-4">
//       Notre équipe de support est disponible par email 7j/7. Nous nous
//       efforçons de répondre à toutes les demandes dans un délai de 24
//       heures.
//     </p>
//     <Link
//       href="mailto:contact@plateforme.tn"
//       className="text-blue-600 font-medium hover:underline flex items-center"
//     >
//       contact@plateforme.tn
//     </Link>
//   </motion.div>

//   <motion.div
//     whileHover={{ y: -5 }}
//     className="bg-white border border-blue-100 rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300"
//   >
//     <h3 className="text-xl md:text-2xl font-bold text-blue-700 mb-4 flex items-center">
//       <Phone className="mr-2 h-6 w-6" /> Par téléphone
//     </h3>
//     <p className="text-gray-700 mb-4">
//       Tu préfères parler à quelqu&apos;un ? Notre service client est
//       disponible du lundi au vendredi, de 9h à 18h.
//     </p>
//     <Link
//       href="tel:+21670123456"
//       className="text-blue-600 font-medium hover:underline flex items-center"
//     >
//       +216 70 123 456
//     </Link>
//   </motion.div>
// </div>

//         {/* Tutorials Section */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.2, duration: 0.5 }}
//           className="bg-white shadow-lg rounded-xl p-6 md:p-8 border border-blue-100"
//         >
//           <h2 className="text-2xl md:text-3xl font-bold mb-4 text-blue-700 flex items-center">
//             <BookOpen className="mr-3 h-7 w-7" /> Tutoriels vidéo
//           </h2>
//           <p className="text-gray-700 mb-6 text-base md:text-lg">
//             Découvre notre bibliothèque de tutoriels vidéo pour apprendre à
//             utiliser toutes les fonctionnalités de notre plateforme :
//           </p>

//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             <TutorialCard
//               title="Comment naviguer sur la plateforme"
//               duration="3:45"
//               icon={<HelpCircle className="h-5 w-5 mr-2" />}
//             />
//             <TutorialCard
//               title="S'inscrire à un cours"
//               duration="2:30"
//               icon={<BookOpen className="h-5 w-5 mr-2" />}
//             />
//             <TutorialCard
//               title="Communiquer avec un professeur"
//               duration="4:15"
//               icon={<MessageCircle className="h-5 w-5 mr-2" />}
//             />
//             <TutorialCard
//               title="Demander un cours personnalisé"
//               duration="5:00"
//               icon={<HelpCircle className="h-5 w-5 mr-2" />}
//             />
//           </div>
//         </motion.div>

//         {/* Support Message */}
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.3, duration: 0.7 }}
//           className="bg-gradient-to-r from-blue-600 to-blue-400 p-8 rounded-xl text-center border border-blue-300 shadow-lg"
//         >
//           <h2 className="text-xl md:text-2xl font-bold text-white mb-3">
//             Nous sommes là pour t&apos;accompagner
//           </h2>
//           <p className="text-white text-base md:text-lg mb-6">
//             Notre mission est de rendre l&apos;apprentissage accessible et
//             agréable pour tous les étudiants tunisiens.
//           </p>
//           <Link
//             href="/contact"
//             className="inline-block bg-white text-blue-700 font-bold py-3 px-6 rounded-full hover:bg-blue-50 transition-colors duration-300"
//           >
//             Contacte-nous
//           </Link>
//         </motion.div>
//       </section>
//     </main>
//   );
// }

// function TutorialCard({
//   title,
//   duration,
//   icon,
// }: {
//   title: string;
//   duration: string;
//   icon: React.ReactNode;
// }) {
//   return (
//     <motion.div
//       whileHover={{ scale: 1.03 }}
//       className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-center justify-between hover:bg-blue-100 transition-colors duration-300"
//     >
//       <div className="flex items-center">
//         {icon}
//         <span className="font-medium text-blue-800">{title}</span>
//       </div>
//       <span className="text-sm text-gray-600 bg-white px-2 py-1 rounded-full">
//         {duration}
//       </span>
//     </motion.div>
//   );
// }
