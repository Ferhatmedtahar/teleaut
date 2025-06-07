"use client";

import ExplorerVideo from "@/app/(root)/(videos)/_components/videos/ExplorerVideo";
import { Button } from "@/components/common/buttons/Button";
import type { RelatedVideo } from "@/types/RelatedVideos.interface";
import { ArrowRight, BookOpen, Play, Sparkles, Users } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

interface GuestHomePageProps {
  readonly videos?: RelatedVideo[];
  readonly success?: boolean;
  readonly search?: string;
}

const fadeInUp = {
  initial: { opacity: 0, y: 5 },
  animate: { opacity: 1, y: 0 },
};

const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.99 },
  animate: { opacity: 1, scale: 1 },
};

export default function GuestHomePage({
  videos = [],
  success = true,
  search = "",
}: GuestHomePageProps) {
  const explorerVideos = videos.length > 0 ? videos : [];
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (search && resultsRef.current) {
      const scrollTimeout = setTimeout(() => {
        resultsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest",
        });

        setTimeout(() => {
          const event = new Event("scroll");
          window.dispatchEvent(event);
        }, 800);
      }, 100);

      return () => clearTimeout(scrollTimeout);
    }
  }, [search]);

  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      <section className="opacity-95 bg-[#0F2C3F] bg-gradient-to-tr from-[#16222A] to-[#355869] dark:bg-gradient-to-tr dark:from-[#0B111E] dark:via-[#14212E] dark:to-[#1F2F3F] px-4 py-26 sm:py-32 md:px-8 lg:px-10 relative border-b border-border/60 dark:border-border/90 ">
        <Image
          src={`icons/guestBlob.svg`}
          alt="Background Blob"
          className=" opacity-60 bottom-4 left-0 absolute z-10  animate-pulse pointer-events-none"
          height={500}
          width={500}
        />
        <Image
          src={`icons/guestBlob.svg`}
          alt="Background Blob"
          className="  top-4 right-0 absolute z-10  animate-pulse pointer-events-none"
          height={500}
          width={500}
        />
        <motion.div
          className="mx-auto max-w-4xl text-center relative z-0"
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          <motion.div
            variants={fadeInUp}
            transition={{ duration: 0.7, ease: [0.22, 0.03, 0.26, 1] }}
            className="mb-10"
          >
            <motion.div
              className="cursor-default inline-flex items-center gap-1.5 sm:gap-2 px-4 py-2 rounded-full  border bg-primary-900/70 border-[#355869]/40 mb-10"
              whileHover={{ scale: 1.03, y: -2 }}
              transition={{ duration: 0.8, ease: [0.22, 0.03, 0.26, 1] }}
            >
              <Sparkles className="w-4 h-4 text-white" />
              <span className="text-xs sm:text-sm font-medium text-white text-nowrap">
                Plateforme d&apos;apprentissage de confiance
              </span>
            </motion.div>

            <h1 className="  text-white/85   text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl leading-tight">
              Bienvenue sur{" "}
              <motion.span
                className="bg-gradient-to-r from-primary-800 via-primary/80 to-primary-500/60 bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                Cognacia
              </motion.span>
            </h1>
          </motion.div>

          <motion.p
            variants={fadeInUp}
            transition={{
              duration: 0.7,
              delay: 0.1,
              ease: [0.22, 0.03, 0.26, 1],
            }}
            className="mb-12 text-lg text-white/90 dark:text-muted-foreground md:text-xl max-w-2xl mx-auto leading-relaxed"
          >
            Découvrez une plateforme d&apos;apprentissage innovante où
            enseignants et étudiants se connectent pour partager des
            connaissances et créer un avenir meilleur.
          </motion.p>

          <motion.div
            variants={fadeInUp}
            transition={{
              duration: 0.7,
              delay: 0.2,
              ease: [0.22, 0.03, 0.26, 1],
            }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/sign-up/info">
              <motion.div
                whileHover={{ scale: 1.005 }}
                whileTap={{ scale: 0.995 }}
                transition={{ duration: 0.6, ease: [0.22, 0.03, 0.26, 1] }}
              >
                <Button
                  size="lg"
                  className="w-full sm:w-auto group px-8 py-3 border border-primary-900  "
                >
                  Commencer gratuitement
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-500" />
                </Button>
              </motion.div>
            </Link>
            <Link href="/sign-in">
              <motion.div
                whileHover={{ scale: 1.005 }}
                whileTap={{ scale: 0.995 }}
                transition={{ duration: 0.6, ease: [0.22, 0.03, 0.26, 1] }}
              >
                <Button
                  variant="outline"
                  size="lg"
                  className=" bg-white/95 w-full sm:w-auto px-8 py-3 border-border/70 hover:border-[#355869]/20"
                >
                  Se connecter
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {!success ? (
        <motion.section
          className="px-4 py-16 md:px-6 lg:px-10"
          initial="initial"
          animate="animate"
          variants={fadeInUp}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.7, ease: [0.22, 0.03, 0.26, 1] }}
        >
          <div className="mx-auto max-w-6xl">
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">Erreur de chargement</h3>
              <p className="text-muted-foreground">
                Impossible de charger les vidéos. Veuillez réessayer plus tard.
              </p>
            </div>
          </div>
        </motion.section>
      ) : (
        <section className="px-4 py-24 md:px-6 lg:px-10">
          <div className="mx-auto max-w-6xl space-y-24">
            {explorerVideos.length > 0 ? (
              <motion.div
                ref={resultsRef}
                initial="initial"
                animate={search ? "animate" : "initial"}
                whileInView="animate"
                viewport={{ once: true }}
                variants={staggerContainer}
                className="scroll-mt-20"
              >
                <motion.h2
                  variants={fadeInUp}
                  className="text-3xl font-bold mb-10 text-center"
                  transition={{ duration: 0.7, ease: [0.22, 0.03, 0.26, 1] }}
                >
                  {search ? `Résultats pour "${search}"` : " Dernières vidéos"}
                </motion.h2>
                <motion.div
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                  variants={staggerContainer}
                >
                  {explorerVideos.slice(0, 6).map((video) => (
                    <motion.div
                      key={video.id}
                      variants={scaleIn}
                      // whileHover={{ y: -1 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.8,
                        ease: [0.22, 0.03, 0.26, 1],
                      }}
                    >
                      <ExplorerVideo video={video} user={video.teacher} />
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            ) : (
              <div>
                <motion.h2
                  variants={fadeInUp}
                  className="text-3xl font-bold mb-10 text-center"
                  transition={{ duration: 0.7, ease: [0.22, 0.03, 0.26, 1] }}
                >
                  {search ? `Résultats pour "${search}"` : "Dernières vidéos"}
                </motion.h2>

                <motion.p
                  variants={fadeInUp}
                  className="text-lg text-center text-muted-foreground max-w-xl mx-auto"
                  transition={{
                    duration: 0.7,
                    ease: [0.22, 0.03, 0.26, 1],
                    delay: 0.1,
                  }}
                >
                  Aucune vidéo n&apos;a été trouvée concernant{" "}
                  <strong>&quot;{search}&quot;</strong>. Nous vous invitons à
                  explorer d&apos;autres sujets passionnants — votre prochaine
                  découverte vous attend.
                </motion.p>
              </div>
            )}
          </div>
        </section>
      )}

      <section className="px-4 pb-24 pt-10 md:px-6 lg:px-10 relative">
        <motion.div
          className="mx-auto max-w-6xl"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-5%" }}
          variants={staggerContainer}
        >
          <motion.h2
            variants={fadeInUp}
            className="mb-10 sm:mb-12 text-center text-3xl font-bold"
            transition={{ duration: 0.7, ease: [0.22, 0.03, 0.26, 1] }}
          >
            Pourquoi choisir Cognacia ?
          </motion.h2>

          <motion.div
            className="grid gap-10 md:grid-cols-2 lg:grid-cols-3"
            variants={staggerContainer}
          >
            {[
              {
                icon: Play,
                title: "Contenu Vidéo",
                description:
                  "Accédez à des milliers de vidéos éducatives créées par des experts.",
              },
              {
                icon: Users,
                title: "Communauté",
                description:
                  "Rejoignez une communauté d'apprenants et d'enseignants passionnés.",
              },
              {
                icon: BookOpen,
                title: "Apprentissage",
                description:
                  "Apprenez à votre rythme avec des outils d'apprentissage modernes.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                whileHover={{ y: -1, scale: 1.01 }}
                transition={{ duration: 0.5, ease: [0.22, 0.03, 0.26, 1] }}
                className="text-center p-10 rounded-xl border border-[#355869]/5 bg-gradient-to-br from-card via-card to-card/95 shadow-lg hover:shadow-xl transition-shadow duration-1000"
              >
                <motion.div
                  className="mb-6 inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-[#355869]/10 to-primary/10"
                  whileHover={{ rotate: 3 }}
                  transition={{ duration: 0.5 }}
                >
                  <feature.icon className="h-7 w-7 text-[#355869]" />
                </motion.div>
                <h3 className="mb-4 text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      <motion.section
        className="px-4 py-24 md:px-6 lg:px-10 bg-[#0F2C3F] bg-gradient-to-tr from-[#16222A] to-[#355869] dark:bg-gradient-to-tr dark:from-[#0B111E] dark:via-[#14212E] dark:to-[#1F2F3F] relative overflow-hidden"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: "-50%" }}
        variants={staggerContainer}
      >
        <motion.div
          className="mx-auto max-w-4xl relative z-10"
          variants={staggerContainer}
        >
          <motion.div
            className="grid gap-16 md:grid-cols-3 text-center"
            variants={staggerContainer}
          >
            {[
              { number: "100+", label: "Vidéos disponibles" },
              { number: "50+", label: "Enseignants actifs" },
              { number: "500+", label: "Étudiants inscrits" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.5, ease: [0.22, 0.03, 0.26, 1] }}
              >
                <motion.div
                  className="mb-3 text-4xl font-bold text-primary-50"
                  initial={{ scale: 0.95, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{
                    delay: index * 0.2,
                    duration: 0.5,
                    ease: [0.22, 0.03, 0.26, 1],
                  }}
                >
                  {stat.number}
                </motion.div>
                <div className="text-primary-100 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.section>

      <motion.section
        className="px-4 py-28 md:px-6 lg:px-10 relative"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: "-5%" }}
      >
        <motion.div
          className="mx-auto max-w-2xl text-center"
          variants={staggerContainer}
        >
          <motion.h2
            variants={fadeInUp}
            transition={{ duration: 0.7, ease: [0.22, 0.03, 0.26, 1] }}
            className="mb-6 text-3xl font-bold"
          >
            Prêt à commencer votre aventure d&apos;apprentissage ?
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            transition={{
              duration: 0.7,
              delay: 0.1,
              ease: [0.22, 0.03, 0.26, 1],
            }}
            className="mb-12 text-lg text-muted-foreground leading-relaxed"
          >
            Rejoignez des milliers d&apos;apprenants qui transforment déjà leur
            avenir avec Cognacia.
          </motion.p>
          <motion.div
            variants={fadeInUp}
            transition={{
              duration: 0.7,
              delay: 0.2,
              ease: [0.22, 0.03, 0.26, 1],
            }}
          >
            <Link href="/sign-up">
              <motion.div
                whileHover={{ scale: 1.005 }}
                whileTap={{ scale: 0.995 }}
                transition={{ duration: 0.6, ease: [0.22, 0.03, 0.26, 1] }}
              >
                <Button
                  size="lg"
                  className="px-10 py-4 group bg-gradient-to-r from-primary to-[#355869] hover:from-primary/98 hover:to-[#355869]/98 text-base"
                >
                  Créer un compte gratuit
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-500" />
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </motion.div>
      </motion.section>
    </div>
  );
}
