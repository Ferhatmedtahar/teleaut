import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BookOpen, HelpCircle, Mail, MessageCircle, Phone } from "lucide-react";
import Link from "next/link";
import type React from "react";

export const metadata = {
  title: "Aide | Support & FAQ - TéléAutism",
  description:
    "Besoin d’aide pour utiliser la plateforme ? Découvrez comment prendre un rendez-vous, contacter un médecin, accéder à vos notes médicales et discuter avec votre spécialiste. Notre équipe est là pour vous accompagner.",
};

export default function AidePage() {
  return (
    <main className="min-h-screen bg-background text-gray-800 pb-20">
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1a4d5c] via-[#206b7a] to-[#2d8a94] dark:from-[hsl(177,85%,12%)] dark:via-[hsl(177,90%,15%)] dark:to-[hsl(177,95%,18%)] text-white py-16 px-6">
        <div className="absolute inset-0 bg-primary/5"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/20 to-transparent"></div>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Aide</h1>
          <p className="text-lg sm:text-xl text-primary-50">
            Besoin d&apos;aide pour utiliser la plateforme ? Nous sommes là pour
            vous !
          </p>
        </div>
        <div className="absolute top-1/2 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-20 w-32 h-32 bg-primary-300/20 rounded-full blur-2xl"></div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 space-y-16">
        <div className="text-center">
          <h2 className="text-3xl font-bold  overflow-hidden primary-gradient-light  bg-clip-text mb-10">
            Comment pouvons-nous vous aider ?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <HelpCard
              title="Prendre un rendez-vous"
              desc="Choisissez un médecin selon sa spécialité, puis planifiez une consultation en ligne facilement."
              icon={<HelpCircle className="w-6 h-6" />}
              gradient="from-primary-600 to-primary-800"
            />
            <HelpCard
              title="Accéder à vos notes médicales"
              desc="Consultez, suivez ou téléchargez vos notes médicales rédigées par votre médecin."
              icon={<BookOpen className="w-6 h-6" />}
              gradient="from-primary-500 to-primary-700"
            />
            <HelpCard
              title="Discuter avec un médecin"
              desc="Utilisez le chat sécurisé pour échanger directement avec votre professionnel de santé."
              icon={<MessageCircle className="w-6 h-6" />}
              gradient="from-primary-600 to-primary-900"
            />
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className=" overflow-hidden primary-gradient-light  bg-clip-text  text-2xl font-bold text-center mb-6">
            Questions fréquentes
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-primary-600 to-primary-800 rounded-full mx-auto mb-8" />

          <Accordion type="single" collapsible className="space-y-4">
            <Faq
              question="Comment prendre rendez-vous avec un médecin ?"
              answer="Depuis la page d’accueil, consultez la liste des médecins et cliquez sur celui de votre choix. Vous pourrez ensuite sélectionner une date et envoyer votre demande de rendez-vous."
            />
            <Faq
              question="Comment savoir si mon rendez-vous a été accepté ?"
              answer="Une fois votre demande envoyée, le médecin peut l'accepter, la refuser ou la reprogrammer. Vous recevrez une notification selon sa décision."
            />
            <Faq
              question="Où puis-je consulter mes notes médicales ?"
              answer="Dans votre espace patient, sous « Notes médicales », vous trouverez les rapports, les instructions et les diagnostics rédigés par votre médecin."
            />
            <Faq
              question="Puis-je discuter avec mon médecin avant un rendez-vous ?"
              answer="Oui, vous pouvez utiliser la messagerie intégrée pour poser vos questions ou clarifier certains points avant votre consultation."
            />
            <Faq
              question="Comment trouver un médecin selon sa spécialité ?"
              answer="Sur la page d’accueil, utilisez les filtres ou parcourez la liste des médecins pour choisir en fonction de leur domaine de spécialité."
            />
          </Accordion>
        </div>

        {/* Contact Section */}
        <div className="relative max-w-2xl mx-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-200/30 to-primary-300/30 rounded-3xl blur-xl" />

          <div className="relative bg-white dark:bg-background backdrop-blur-sm p-8 sm:p-12 rounded-3xl border border-primary-200/50 dark:border-border/90 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-900 rounded-full mb-6 text-white text-2xl shadow-xs">
              💬
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold  overflow-hidden primary-gradient-light   bg-clip-text mb-4">
              Vous avez encore besoin d&apos;aide ?
            </h2>

            <p className="text-gray-700 dark:text-gray-100 text-lg mb-6">
              Notre équipe est disponible pour vous accompagner dans
              l’utilisation de la plateforme. Contactez-nous à tout moment !
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <ContactButton
                text="Envoyer un email"
                icon={<Mail className="w-5 h-5" />}
                href="mailto:support@teleautism.com"
                primary
              />

              <ContactButton
                text="Appeler le support"
                icon={<Phone className="w-5 h-5" />}
                href="tel:+21300000000"
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
    <div className="bg-white dark:bg-background backdrop-blur-sm border border-primary-200/50 dark:border-border/90 rounded-2xl p-6 shadow-lg shadow-gray-900/5 hover:shadow-2xl hover:shadow-primary-900/10 transition-transform hover:-translate-y-0.5 duration-300 group">
      <div
        className={`w-12 h-12 flex items-center justify-center rounded-xl mb-4 text-white shadow-md bg-gradient-to-br ${gradient} transition-transform `}
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
