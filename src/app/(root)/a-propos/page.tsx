export const metadata = {
  title: "À propos de nous | TéléAutism - Votre plateforme de santé en ligne",
  description:
    "Découvrez TéléAutism, la plateforme qui connecte patients et médecins spécialisés en autisme. Consultations en ligne, notes médicales, chat sécurisé et communauté d'entraide.",
};

export default function AProposPage() {
  return (
    <main className="min-h-screen bg-background text-gray-800">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1a4d5c] via-[#206b7a] to-[#2d8a94] dark:from-[hsl(177,85%,12%)] dark:via-[hsl(177,90%,15%)] dark:to-[hsl(177,95%,18%)] text-white px-6">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-100/20 to-transparent"></div>
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center max-w-4xl">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            À propos de TéléAutism
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl text-primary-50 font-light">
            Connecter patients et médecins pour un suivi médical accessible,
            humain et moderne.
          </p>
        </div>

        {/* Decorative lights */}
        <div className="absolute -top-10 left-1/3 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-indigo-300/20 rounded-full blur-2xl"></div>
      </section>
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="relative dark:bg-background backdrop-blur-sm shadow-2xl shadow-primary-900/5 rounded-3xl p-8 sm:p-12 border border-border/20 dark:border-border/80">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-900 rounded-2xl flex items-center justify-center text-2xl text-white">
                🎯
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold  overflow-hidden primary-gradient-light  bg-clip-text text-transparent">
                Notre mission
              </h2>
            </div>
          </div>
          <p className="text-gray-700 dark:text-gray-100 text-lg leading-relaxed mb-6">
            Rendre les soins médicaux accessibles à tous, partout et à tout
            moment. Nous croyons que{" "}
            <strong className="text-primary-700 dark:text-primary-400">
              chaque patient mérite un suivi personnalisé, des réponses rapides
              et un accompagnement humain
            </strong>
            .
          </p>
          <p className="text-gray-700 dark:text-gray-100 text-lg leading-relaxed">
            Avec TéléAutism, vous pouvez prendre rendez-vous en quelques clics,
            consulter vos notes médicales, échanger avec votre médecin et
            rejoindre une communauté solidaire.
          </p>
        </div>
      </section>

      {/* Valeurs */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 ">
        <h2 className="text-center text-3xl sm:text-4xl font-bold  overflow-hidden primary-gradient-light  bg-clip-text text-transparent mb-12">
          Nos valeurs
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <ValueCard
            title="Accessibilité"
            desc="Des soins de qualité pour tous, peu importe où vous êtes. La distance ne doit plus être un frein à votre santé."
            icon="🤝"
            gradient="from-primary-600 to-primary-900"
          />
          <ValueCard
            title="Confidentialité"
            desc="Vos données médicales sont protégées et sécurisées. Nous respectons votre vie privée à chaque étape."
            icon="🔒"
            gradient="from-primary-600 to-primary-900"
          />
          <ValueCard
            title="Bienveillance"
            desc="Une plateforme humaine où patients et médecins échangent dans le respect, l'écoute et la confiance."
            icon="💙"
            gradient="from-primary-600 to-primary-900"
          />
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 ">
        <h2 className="text-center text-3xl sm:text-4xl font-bold  overflow-hidden primary-gradient-light  bg-clip-text text-transparent mb-12">
          Comment ça marche ?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <ProcessCard
            title="Pour les patients"
            steps={[
              "Créez votre compte gratuitement",
              "Choisissez un médecin spécialisé",
              "Prenez rendez-vous en ligne",
              "Consultez vos notes médicales",
              "Échangez via chat sécurisé",
              "Rejoignez des groupes de discussion",
            ]}
            icon="👤"
          />
          <ProcessCard
            title="Pour les médecins"
            steps={[
              "Inscrivez-vous en tant que professionnel",
              "Gérez vos disponibilités",
              "Acceptez ou refusez les demandes",
              "Rédigez des notes médicales",
              "Communiquez avec vos patients",
              "Participez aux discussions de groupe",
            ]}
            icon="👨‍⚕️"
          />
        </div>
      </section>

      {/* Vision */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="relative dark:bg-background backdrop-blur-sm p-12 rounded-3xl border border-border/20 dark:border-border/80 shadow-xl shadow-primary-900/10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-600 to-primary-900 rounded-full mb-6 text-3xl text-white">
            🔮
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold  overflow-hidden primary-gradient-light  bg-clip-text  text-transparent mb-4">
            Notre vision
          </h2>
          <p className="text-gray-700 dark:text-gray-100 text-lg leading-relaxed max-w-2xl mx-auto">
            Nous rêvons d'un système de santé où chaque patient peut consulter
            un spécialiste rapidement, où les médecins peuvent exercer
            efficacement, et où la technologie sert l'humain. Un futur où les
            soins sont accessibles, transparents et bienveillants.
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
    <div className="bg-white dark:bg-background backdrop-blur-sm border border-primary-200/50 dark:border-border/90 rounded-2xl p-6 shadow-lg shadow-gray-900/5 hover:shadow-2xl hover:shadow-primary-900/10 transition-transform hover:-translate-y-1 duration-300 group">
      <div
        className={`w-12 h-12 flex items-center justify-center rounded-xl mb-4 text-white shadow-md bg-gradient-to-br ${gradient} transition-transform `}
      >
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-100 mb-2 group-hover:text-gray-800 transition-colors">
        {title}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-200 group-hover:text-gray-700 transition-colors leading-relaxed">
        {desc}
      </p>
    </div>
  );
}

function ProcessCard({
  title,
  steps,
  icon,
}: {
  title: string;
  steps: string[];
  icon: string;
}) {
  return (
    <div className="bg-white dark:bg-background backdrop-blur-sm border border-primary-200/50 dark:border-border/90 rounded-2xl p-8 shadow-lg shadow-gray-900/5">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-14 h-14 bg-gradient-to-br from-primary-600 to-primary-900 rounded-2xl flex items-center justify-center text-3xl text-white shadow-md">
          {icon}
        </div>
        <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-100">
          {title}
        </h3>
      </div>
      <ul className="space-y-3">
        {steps.map((step, index) => (
          <li key={index} className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
              {index + 1}
            </span>
            <span className="text-gray-700 dark:text-gray-200 text-base">
              {step}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
