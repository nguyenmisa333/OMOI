import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Impressum | O·MO·I — Stuttgart',
  description: 'Impressum von O·MO·I — Japanisch inspiriertes Brunch-Café in Stuttgart.',
  robots: 'noindex, follow',
}

export default function ImpressumPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-12 md:py-20">
      <p className="text-[10px] font-bold text-[#C4975C] uppercase tracking-[4px] mb-3">Impressum</p>
      <h1 className="text-3xl md:text-4xl font-bold text-[#3b1f0a] mb-2">Impressum</h1>
      <p className="text-stone-400 text-sm mb-10">Angaben gemäß § 5 TMG</p>

      <div className="space-y-10">
        {/* Betreiber */}
        <div>
          <p className="text-[10px] font-bold text-[#C4975C] uppercase tracking-[2px] mb-2">Betreiber</p>
          <h2 className="text-xl font-bold text-[#3b1f0a] mb-3 pb-2 border-b border-stone-200">Angaben gemäß § 5 TMG</h2>
          <p className="text-sm text-stone-500"><strong>O·MO·I</strong></p>
          <p className="text-sm text-stone-500">Hauptstätter Straße 57</p>
          <p className="text-sm text-stone-500">70178 Stuttgart</p>
          <p className="text-sm text-stone-500">Deutschland</p>
        </div>

        {/* Kontakt */}
        <div>
          <p className="text-[10px] font-bold text-[#C4975C] uppercase tracking-[2px] mb-2">Kontakt</p>
          <h2 className="text-xl font-bold text-[#3b1f0a] mb-3 pb-2 border-b border-stone-200">Kontaktdaten</h2>
          <p className="text-sm text-stone-500">E-Mail: <a href="mailto:hello@o-mo-i.de" className="text-[#C4975C] font-semibold hover:underline">hello@o-mo-i.de</a></p>
          <p className="text-sm text-stone-500">Instagram: <a href="https://instagram.com/omoi.stuttgart" target="_blank" rel="noopener noreferrer" className="text-[#C4975C] font-semibold hover:underline">@omoi.stuttgart</a></p>
        </div>

        {/* Haftung Inhalte */}
        <div>
          <p className="text-[10px] font-bold text-[#C4975C] uppercase tracking-[2px] mb-2">Haftungsausschluss</p>
          <h2 className="text-xl font-bold text-[#3b1f0a] mb-3 pb-2 border-b border-stone-200">Haftung für Inhalte</h2>
          <p className="text-sm text-stone-500 leading-relaxed">Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen. Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich.</p>
        </div>

        {/* Haftung Links */}
        <div>
          <p className="text-[10px] font-bold text-[#C4975C] uppercase tracking-[2px] mb-2">Haftung</p>
          <h2 className="text-xl font-bold text-[#3b1f0a] mb-3 pb-2 border-b border-stone-200">Haftung für Links</h2>
          <p className="text-sm text-stone-500 leading-relaxed">Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen.</p>
        </div>

        {/* Urheberrecht */}
        <div>
          <p className="text-[10px] font-bold text-[#C4975C] uppercase tracking-[2px] mb-2">Urheberrecht</p>
          <h2 className="text-xl font-bold text-[#3b1f0a] mb-3 pb-2 border-b border-stone-200">Urheberrecht</h2>
          <p className="text-sm text-stone-500 leading-relaxed">Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet.</p>
        </div>
      </div>
    </div>
  )
}
