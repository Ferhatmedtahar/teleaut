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
            <Faq
              question="Comment regarder les vidéos ?"
              answer="Clique simplement sur n'importe quelle vidéo pour la regarder. Tu peux aussi créer une playlist de tes vidéos favorites."
            />
            <Faq
              question="Comment demander une étude personnalisée ?"
              answer="Va sur le profil du professeur qui t'intéresse, puis clique sur le bouton 'Demander une étude'. Tu pourras expliquer ce dont tu as besoin."
            />
            <Faq
              question="Les cours suivent-ils le programme tunisien ?"
              answer="Oui ! Tous nos professeurs enseignent selon le programme officiel tunisien, de la 7ème année de base jusqu'au baccalauréat."
            />
            <Faq
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

function Faq({ question, answer }: { question: string; answer: string }) {
  return (
    <AccordionItem value={question} className="hover:cursor-pointer ">
      <AccordionTrigger className="text-left text-primary-800 dark:text-primary-50 font-medium text-base hover:text-primary-700 transition hover:underline-offset-2">
        {question}
      </AccordionTrigger>
      <AccordionContent className="text-primary-600 dark:text-primary-200">
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
      className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition hover:scale-102 ${
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
