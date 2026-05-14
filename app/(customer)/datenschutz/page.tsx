import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Datenschutz | O·MO·I — Stuttgart',
  description: 'Datenschutzerklärung von O·MO·I — Brunch-Café in Stuttgart.',
  robots: 'noindex, follow',
}

const sections = [
  {
    tag: 'Allgemein', title: 'Datenschutz auf einen Blick', highlight: true,
    content: 'Der Schutz Ihrer persönlichen Daten ist uns bei O·MO·I ein besonderes Anliegen. Wir verarbeiten Ihre Daten ausschließlich auf Grundlage der gesetzlichen Bestimmungen (DSGVO, TMG).',
    extra: 'Mit dieser Datenschutzerklärung möchten wir Sie über die wichtigsten Aspekte der Datenverarbeitung auf unserer Website informieren.',
  },
  {
    tag: 'Verantwortlicher', title: 'Verantwortliche Stelle',
    lines: ['**O·MO·I**', 'Hauptstätter Straße 57', '70178 Stuttgart, Deutschland', 'E-Mail: hello@o-mo-i.de'],
  },
  {
    tag: 'Datenerfassung', title: 'Welche Daten wir erfassen',
    content: 'Beim Besuch unserer Website werden automatisch folgende Daten durch den Webserver erfasst:',
    list: ['IP-Adresse (anonymisiert)', 'Datum und Uhrzeit des Zugriffs', 'Aufgerufene Seite / Datei', 'Browser-Typ und -Version', 'Betriebssystem', 'Verweisende URL (Referrer)'],
    extra: 'Diese Daten werden nicht mit anderen Datenquellen zusammengeführt und nach 7 Tagen automatisch gelöscht.',
  },
  {
    tag: 'Cookies', title: 'Cookies',
    content: 'Unsere Website verwendet keine Tracking-Cookies oder Analyse-Tools von Drittanbietern. Es werden ausschließlich technisch notwendige Funktionen eingesetzt, die keine personenbezogenen Daten speichern.',
  },
  {
    tag: 'Ihre Rechte', title: 'Ihre Rechte als betroffene Person',
    content: 'Gemäß DSGVO haben Sie folgende Rechte:',
    list: ['Auskunftsrecht (Art. 15 DSGVO)', 'Recht auf Berichtigung (Art. 16 DSGVO)', 'Recht auf Löschung (Art. 17 DSGVO)', 'Recht auf Einschränkung (Art. 18 DSGVO)', 'Recht auf Datenübertragbarkeit (Art. 20 DSGVO)', 'Widerspruchsrecht (Art. 21 DSGVO)'],
    extra: 'Zur Wahrnehmung dieser Rechte wenden Sie sich bitte an: hello@o-mo-i.de',
  },
  {
    tag: 'Aktualität', title: 'Aktualität dieser Erklärung',
    content: 'Diese Datenschutzerklärung hat den Stand: Mai 2026. Wir behalten uns vor, diese Erklärung bei Bedarf zu aktualisieren.',
  },
]

export default function DatenschutzPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-12 md:py-20">
      <p className="text-[10px] font-bold text-[#C4975C] uppercase tracking-[4px] mb-3">Datenschutz</p>
      <h1 className="text-3xl md:text-4xl font-bold text-[#3b1f0a] mb-2">Datenschutzerklärung</h1>
      <p className="text-stone-400 text-sm mb-10">Gemäß DSGVO</p>

      <div className="space-y-10">
        {sections.map((s, i) => (
          <div key={i}>
            <p className="text-[10px] font-bold text-[#C4975C] uppercase tracking-[2px] mb-2">{s.tag}</p>
            <h2 className="text-xl font-bold text-[#3b1f0a] mb-3 pb-2 border-b border-stone-200">{s.title}</h2>
            {s.highlight && s.content && (
              <div className="bg-stone-50 border-l-3 border-[#C4975C] rounded-r-xl px-5 py-4 mb-3">
                <p className="text-sm text-stone-600">{s.content}</p>
              </div>
            )}
            {!s.highlight && s.content && <p className="text-sm text-stone-500 leading-relaxed">{s.content}</p>}
            {s.lines && s.lines.map((l, j) => (
              <p key={j} className="text-sm text-stone-500">{l.startsWith('**') ? <strong>{l.replace(/\*\*/g, '')}</strong> : l}</p>
            ))}
            {s.list && (
              <ul className="list-disc ml-5 mt-2 space-y-1">
                {s.list.map((item, j) => <li key={j} className="text-sm text-stone-500">{item}</li>)}
              </ul>
            )}
            {s.extra && <p className="text-sm text-stone-500 mt-3">{s.extra}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}
