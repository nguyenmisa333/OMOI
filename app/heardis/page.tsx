export default function HeardisPage() {
  return (
    <div style={{ position: 'fixed', inset: 0, background: '#1a1a1a' }}>
      <object
        data="/heardis-menu.pdf#view=FitH&toolbar=1"
        type="application/pdf"
        style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            gap: '20px',
            color: '#fff',
            textAlign: 'center',
            padding: '24px',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          }}
        >
          <p>Ihr Browser kann das PDF nicht direkt anzeigen.</p>
          <a
            href="/heardis-menu.pdf"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: '#C4975C',
              color: '#1a1a1a',
              padding: '14px 28px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '16px',
            }}
          >
            Speisekarte öffnen
          </a>
        </div>
      </object>
    </div>
  )
}
