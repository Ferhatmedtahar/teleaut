export const metadata = {
  title: "Notre mission | Apprendre différemment et librement",
  description:
    "Nous croyons qu'apprendre ne doit pas être une corvée. Notre mission est d'offrir aux étudiants tunisiens un espace moderne, simple et motivant pour apprendre à leur rythme, avec plusieurs professeurs.",
};

export default function MissionPage() {
  return (
    <main className="min-h-screen bg-background text-gray-800">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#0F2C3F] bg-gradient-to-tr from-[#16222A] to-[#355869] dark:bg-gradient-to-tr dark:from-[#0B111E] dark:via-[#14212E] dark:to-[#1F2F3F] text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-100/20 to-transparent"></div>
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center max-w-4xl">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
            Notre mission
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl text-primary-50 font-light">
            Offrir à chaque étudiant tunisien une nouvelle façon d’apprendre,
            libre, moderne et humaine.
          </p>
        </div>

        {/* Decorative lights */}
        <div className="absolute -top-10 left-1/3 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-indigo-300/20 rounded-full blur-2xl"></div>
      </section>

      {/* Mission */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="relative dark:bg-background backdrop-blur-sm shadow-2xl shadow-primary-900/5 rounded-3xl p-8 sm:p-12 border border-border/20 dark:border-border/80">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-900 rounded-2xl flex items-center justify-center text-2xl text-white">
                🌍
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary-600 via-primary-900 to-[#355869] bg-clip-text text-transparent">
                Pourquoi cette plateforme ?
              </h2>
            </div>
          </div>
          <p className="text-gray-700 dark:text-gray-100 text-lg leading-relaxed mb-6">
            Nous avons créé cette plateforme parce que{" "}
            <strong className="text-primary-700 dark:text-primary-400">
              chaque étudiant mérite une explication claire, adaptée et
              motivante
            </strong>
            . L’enseignement ne doit pas être limité à un seul style, ni
            dépendre d’un seul professeur.
          </p>
          <p className="text-gray-700 dark:text-gray-100 text-lg leading-relaxed">
            Ici, chaque prof apporte sa touche, son énergie, et sa façon
            d’expliquer. Tu peux{" "}
            <em className="text-primary-900 font-medium">
              choisir celui qui te correspond le mieux
            </em>
            , et apprendre à ton rythme, sans pression.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <h2 className="text-center text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary-600 via-primary-900 to-[#355869] bg-clip-text text-transparent mb-12">
          Nos valeurs
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <ValueCard
            title="Accessibilité"
            desc="Apprendre devrait être possible pour tous. Peu importe ton niveau, ton rythme ou ton lieu."
            icon="🤝"
            gradient="from-blue-500 to-indigo-600"
          />
          <ValueCard
            title="Liberté"
            desc="Tu choisis ton prof, ton rythme et ton style. L’apprentissage devient enfin personnel."
            icon="🕊️"
            gradient="from-emerald-500 to-teal-600"
          />
          <ValueCard
            title="Excellence"
            desc="Des professeurs passionnés, du contenu vérifié, et une expérience conçue avec soin."
            icon="🏆"
            gradient="from-rose-500 to-pink-600"
          />
        </div>
      </section>

      {/* Vision */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="relative dark:bg-background backdrop-blur-sm p-12 rounded-3xl border border-border/20 dark:border-border/80 shadow-xl shadow-primary-900/10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-600 to-primary-900 rounded-full mb-6 text-3xl text-white">
            🔮
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary-600 via-primary-900 to-[#355869] bg-clip-text text-transparent mb-4">
            Notre vision
          </h2>
          <p className="text-gray-700 dark:text-gray-100 text-lg leading-relaxed max-w-2xl mx-auto">
            Nous rêvons d’un futur où apprendre ne sera plus une obligation,
            mais un plaisir. Où chaque étudiant tunisien aura les outils pour
            réussir, comprendre et s’épanouir — à son propre rythme.
          </p>
        </div>
      </section>
    </main>
  );
}

function ValueCard({
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
      <div className="relative dark:bg-background backdrop-blur-sm border border-border/20 dark:border-border/80 rounded-2xl p-6 sm:p-8 shadow-lg shadow-gray-900/5 hover:shadow-2xl hover:shadow-gray-900/10 transition-transform duration-500 hover:-translate-y-1.5 group">
        <div
          className={`inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br ${gradient} rounded-2xl mb-4 sm:mb-6 text-2xl sm:text-3xl shadow-lg group-hover:scale-110 transition-transform duration-300`}
        >
          {icon}
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-gray-700 dark:text-gray-100 mb-3 sm:mb-4 group-hover:text-gray-800 transition-colors">
          {title}
        </h3>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-200 leading-relaxed group-hover:text-gray-700 transition-colors">
          {desc}
        </p>
      </div>
    </div>
  );
}
