export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative min-h-screen overflow-hidden bg-dot-grid"
      style={{ backgroundColor: 'var(--bg-base)' }}
    >
      {/* Warm amber blob — top left */}
      <div
        className="fixed pointer-events-none anim-float-a"
        style={{
          width: 640,
          height: 640,
          borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(196,148,40,0.1) 0%, transparent 65%)',
          top: -200,
          left: -160,
          zIndex: 0,
        }}
      />
      {/* Terracotta blob — bottom right */}
      <div
        className="fixed pointer-events-none anim-float-b"
        style={{
          width: 560,
          height: 560,
          borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(180,90,40,0.07) 0%, transparent 65%)',
          bottom: -160,
          right: -120,
          zIndex: 0,
        }}
      />
      {/* Pale gold blob — centre */}
      <div
        className="fixed pointer-events-none anim-float-c"
        style={{
          width: 380,
          height: 380,
          borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(220,175,60,0.06) 0%, transparent 70%)',
          top: '40%',
          left: '45%',
          zIndex: 0,
        }}
      />

      <div className="relative z-10 min-h-screen">{children}</div>
    </div>
  );
}
