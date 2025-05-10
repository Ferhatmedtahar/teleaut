// app/about/page.tsx (or /pages/about.tsx if you're using the Pages directory)

import React from "react";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-800">
      <section className="bg-white border-b border-gray-200 py-6 px-8 shadow-sm">
        <h1 className="text-3xl font-semibold">À propos</h1>
        <p className="mt-1 text-sm text-gray-500">
          Apprendre, c&apos;est plus simple ici.
        </p>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-12 space-y-16">
        {/* Intro */}
        <div className="bg-white shadow rounded-xl p-8 border border-gray-200">
          <h2 className="text-2xl font-semibold mb-4 text-blue-700">
            Bienvenue sur ta nouvelle plateforme
          </h2>
          <p className="text-gray-700 mb-3">
            Ici, tu trouves <strong>chaque matière que tu étudies</strong> —
            expliquée par plusieurs profs, chacun avec sa propre méthode. Ce
            n’est <strong>pas comme Taky Academy</strong> où tu es limité à un
            seul prof !
          </p>
          <p className="text-gray-700">
            Oui, chaque professeur peut poster ses vidéos, et tu peux même lui
            demander de te faire une <em>étude personnalisée</em>. Ça semble
            irréel ? C’est pas un rêve, <strong>tu es bien réveillé(e)</strong>{" "}
            !
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard
            title="Explications variées"
            desc="Chaque prof a sa méthode. Tu choisis celui qui t’aide à mieux comprendre."
            icon="📚"
          />
          <FeatureCard
            title='Cours "Étude" personnalisés'
            desc="Besoin d’aide ? Tu peux demander un cours privé à n’importe quel prof."
            icon="👨‍🏫"
          />
          <FeatureCard
            title="Programme tunisien"
            desc="Tous les cours suivent exactement le programme scolaire en Tunisie."
            icon="🇹🇳"
          />
        </div>

        {/* Dream message */}
        <div className="bg-gradient-to-r from-blue-100 to-blue-50 p-8 rounded-xl text-center border border-blue-200 shadow-sm">
          <h2 className="text-xl font-semibold text-blue-800 mb-2">
            Ce n’est pas un rêve, c’est ta nouvelle réalité
          </h2>
          <p className="text-gray-700">
            Le rêve de chaque étudiant : apprendre à son rythme, avec le bon
            prof, depuis n’importe où.
          </p>
        </div>

        {/* Audience */}
        <div className="bg-white shadow rounded-xl p-8 border border-gray-200">
          <h2 className="text-2xl font-semibold mb-4 text-blue-700">
            Pour qui est cette plateforme ?
          </h2>
          <p className="text-gray-700 mb-4">
            Cette plateforme est pensée pour les étudiants tunisiens, du collège
            au lycée, qui veulent :
          </p>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li>Mieux comprendre leurs cours</li>
            <li>Réviser plus efficacement</li>
            <li>Avoir plusieurs approches pour le même sujet</li>
            <li>Obtenir du soutien personnalisé à tout moment</li>
          </ul>
        </div>
      </section>
    </main>
  );
}

function FeatureCard({
  title,
  desc,
  icon,
}: {
  title: string;
  desc: string;
  icon: string;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{desc}</p>
    </div>
  );
}
