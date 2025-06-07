import { Button } from "@/components/common/buttons/Button";

export const metadata = {
  title: "À propos | Apprends à ton rythme avec plusieurs professeurs",
  description:
    "Découvre notre plateforme éducative unique conçue pour les étudiants tunisiens. Apprends chaque matière avec des explications variées, accède à des cours personnalisés, et suis le programme officiel avec les meilleurs profs, à ton rythme.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background text-gray-800">
      <section className="relative overflow-hidden bg-[#0F2C3F] bg-gradient-to-tr from-[#16222A] to-[#355869] dark:bg-gradient-to-tr dark:from-[#0B111E] dark:via-[#14212E] dark:to-[#1F2F3F] text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-100/20 to-transparent"></div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 tracking-tight">
              À propos
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-primary-50 font-light">
              Apprendre, c&apos;est plus simple ici.
            </p>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-1/2 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-20 w-32 h-32 bg-indigo-300/20 rounded-full blur-2xl"></div>
      </section>

      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 space-y-16 sm:space-y-20 lg:space-y-24">
        {/* Intro */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-600/5 to-primary-900/5 rounded-3xl blur-3xl transform -rotate-1"></div>
          <div className="relative dark:bg-background backdrop-blur-sm shadow-2xl shadow-primary-900/5 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 border border-border/20 dark:border-border/90">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-primary-600 to-primary-900 rounded-2xl flex items-center justify-center text-white text-xl sm:text-2xl font-bold shadow-lg">
                🚀
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 bg-gradient-to-r from-primary-600 via-primary-900 to-[#355869]  dark:from:primary-200 dark:to-primary-500 dark:via-primary-400 bg-clip-text text-transparent">
                Bienvenue sur ta nouvelle plateforme
              </h2>
            </div>
            <div className="space-y-4 text-gray-700 dark:text-gray-100 text-base sm:text-lg leading-relaxed">
              <p>
                Ici, tu trouves{" "}
                <strong className="text-blue-700">
                  chaque matière que tu étudies
                </strong>{" "}
                — expliquée par plusieurs profs, chacun avec sa propre méthode.
                Ce n&apos;est{" "}
                <strong className="text-indigo-700">
                  pas comme Taky Academy
                </strong>{" "}
                où tu es limité à un seul prof !
              </p>
              <p>
                Oui, chaque professeur peut poster ses vidéos, et tu peux même
                lui demander de te faire une{" "}
                <em className="text-primary-900 font-medium">
                  étude personnalisée
                </em>
                . Ça semble irréel ? C&apos;est pas un rêve,{" "}
                <strong className="text-primary-700">
                  tu es bien réveillé(e)
                </strong>{" "}
                !
              </p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <FeatureCard
            title="Explications variées"
            desc="Chaque prof a sa méthode. Tu choisis celui qui t'aide à mieux comprendre."
            icon="📚"
            gradient="from-emerald-500 to-teal-600"
          />
          <FeatureCard
            title='Cours "Étude" personnalisés'
            desc="Besoin d'aide ? Tu peux demander un cours privé à n'importe quel prof."
            icon="👨‍🏫"
            gradient="from-violet-500 to-purple-600"
          />
          <FeatureCard
            title="Programme tunisien"
            desc="Tous les cours suivent exactement le programme scolaire en Tunisie."
            icon="🇹🇳"
            gradient="from-rose-500 to-pink-600"
          />
        </div>

        <div className="relative">
          {/* <div className="absolute inset-0  bg-gradient-to-tr from-[#16222A01] to-[#35586901] rounded-3xl blur-lg"></div> */}
          <div className="relative  dark:bg-background  backdrop-blur-sm p-8 sm:p-12 lg:p-16 rounded-2xl sm:rounded-3xl text-center border border-primary-200/50 dark:border-border/90 shadow-2xl shadow-primary-900/5">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20  bg-gradient-to-br from-primary-600 to-primary-900 rounded-full mb-6 text-2xl sm:text-3xl shadow-lg">
              ✨
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary-600 via-primary-900 to-[#355869]  dark:from:primary-200 dark:to-primary-500 dark:via-primary-400 bg-clip-text text-transparent mb-4 sm:mb-6">
              Ce n&apos;est pas un rêve, c&apos;est ta nouvelle réalité
            </h2>
            <p className="text-gray-700 dark:text-gray-100 text-lg sm:text-xl leading-relaxed max-w-3xl mx-auto">
              Le rêve de chaque étudiant : apprendre à son rythme, avec le bon
              prof, depuis n&apos;importe où.
            </p>
          </div>
        </div>

        {/* Audience */}
        <div className="relative">
          {/* <div className="absolute inset-0  bg-gradient-to-tr from-[#16222A11] to-[#35586911]  rounded-3xl blur-2xl transform rotate-1"></div> */}
          <div className="relative  dark:bg-background backdrop-blur-sm shadow-2xl shadow-primary-900/5 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 border border-border/20 dark:border-border/90">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16  bg-gradient-to-br from-primary-600 to-primary-900  rounded-2xl flex items-center justify-center text-white text-xl sm:text-2xl font-bold shadow-lg">
                🎯
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 bg-gradient-to-r from-primary-600 via-primary-900 to-[#355869]  dark:from:primary-200 dark:to-primary-500 dark:via-primary-400 bg-clip-text text-transparent">
                Pour qui est cette plateforme ?
              </h2>
            </div>
            <p className="text-gray-700 dark:text-gray-100 mb-6 text-base sm:text-lg leading-relaxed">
              Cette plateforme est pensée pour les étudiants tunisiens, du
              collège au lycée, qui veulent :
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <BenefitItem text="Mieux comprendre leurs cours" icon="🧠" />
              <BenefitItem text="Réviser plus efficacement" icon="⚡" />
              <BenefitItem
                text="Avoir plusieurs approches pour le même sujet"
                icon="🔄"
              />
              <BenefitItem
                text="Obtenir du soutien personnalisé à tout moment"
                icon="🤝"
              />
            </div>
          </div>
        </div>
      </section>
      <section className="text-center pb-12 text-gray-600 dark:text-primary-50">
        <p className="py-2">Prêt(e) à apprendre autrement ?</p>
        <Button className="rounded-full py-3 px-6">Commencer maintenant</Button>
      </section>
    </main>
  );
}

function FeatureCard({
  title,
  desc,
  icon,
  gradient,
}: {
  title: string;
  desc: string;
  icon: string;
  gradient: string;
}) {
  return (
    <div className="group relative">
      <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-2xl blur-xl"></div>
      <div className="relative  dark:bg-background backdrop-blur-sm border border-border/20 dark:border-border/90 rounded-2xl p-6 sm:p-8 shadow-lg shadow-gray-900/5 hover:shadow-2xl hover:shadow-gray-900/10 transition-transform duration-500 hover:-translate-y-1.5 group">
        <div
          className={`inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br ${gradient} rounded-2xl mb-4 sm:mb-6 text-2xl sm:text-3xl shadow-lg group-hover:scale-110 transition-transform duration-300`}
        >
          {icon}
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-gray-700 dark:text-gray-100  mb-3 sm:mb-4 group-hover:text-gray-800  transition-colors">
          {title}
        </h3>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-200 leading-relaxed group-hover:text-gray-700 transition-colors">
          {desc}
        </p>
      </div>
    </div>
  );
}

function BenefitItem({ text, icon }: { text: string; icon: string }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl  dark:bg-background backdrop-blur-sm border border-gray-200/50 dark:border-border/90 hover:from-blue-50 hover:to-indigo-50 hover:border-blue-200/50  group">
      <div className="flex-shrink-0 w-8 h-8  bg-gradient-to-br from-primary-600 to-primary-900  rounded-lg flex items-center justify-center text-white text-sm  transition-transform duration-200">
        {icon}
      </div>
      <span className="text-gray-700 dark:text-gray-100 font-medium text-sm sm:text-base group-hover:text-gray-800 transition-colors">
        {text}
      </span>
    </div>
  );
}
