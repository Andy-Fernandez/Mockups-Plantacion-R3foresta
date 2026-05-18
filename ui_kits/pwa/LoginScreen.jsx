function LoginScreen({ onLogin }) {
  const [isRegistering, setIsRegistering] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [username, setUsername] = React.useState('');
  const [email, setEmail] = React.useState('');

  const fakeLogin = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    setLoading(false);
    onLogin();
  };

  return (
    <div className="px-4 pt-8 pb-10">
      <div className="relative overflow-hidden rounded-[28px] bg-white text-brand-800 shadow-2xl">
        <div className="relative h-48">
          <img src="../../assets/hero-canopy.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/60 to-brand-900/90" />
          <div className="relative flex h-full flex-col justify-between p-5 text-white">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="rounded-full bg-white/25 px-3 py-1 backdrop-blur">Passkeys</span>
              <span className="rounded-full bg-white/20 px-3 py-1">Biometría</span>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-white/90">Ingreso</p>
              <h2 className="text-2xl font-semibold leading-tight">Acceso sin contraseñas</h2>
              <p className="mt-1 text-sm">Face ID, huella o Windows Hello.</p>
            </div>
          </div>
        </div>

        <div className="space-y-5 px-5 pb-6 pt-5">
          <div className="flex items-center justify-between">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-500">{isRegistering ? 'Crear cuenta' : 'Iniciar sesión'}</div>
            <div className="rounded-full bg-brand-50 px-3 py-1 text-[11px] font-bold text-brand-600">Passkeys</div>
          </div>

          <div className="relative rounded-full border border-white/60 bg-slate-100/90 p-1 shadow-soft">
            <div className={`absolute top-1 h-[calc(100%-8px)] w-[48%] rounded-full bg-gradient-to-r from-brand-600 to-brand-700 shadow-soft transition-all duration-300 ${isRegistering ? 'translate-x-[104%]' : 'translate-x-[4%]'}`} />
            <div className="relative z-10 grid grid-cols-2 text-[13px] font-extrabold">
              <button type="button" onClick={() => setIsRegistering(false)} className={`flex items-center justify-center rounded-full px-4 py-2 transition ${!isRegistering ? 'text-white' : 'text-slate-600'}`}>Iniciar sesión</button>
              <button type="button" onClick={() => setIsRegistering(true)} className={`flex items-center justify-center rounded-full px-4 py-2 transition ${isRegistering ? 'text-white' : 'text-slate-600'}`}>Crear cuenta</button>
            </div>
          </div>

          {!isRegistering ? (
            <div className="flex flex-col gap-5">
              <button onClick={fakeLogin} disabled={loading} className="flex w-full items-center justify-center gap-3 rounded-2xl bg-brand-600 px-4 py-4 text-lg font-extrabold text-white shadow-soft hover:bg-brand-700 active:scale-[0.99] disabled:opacity-60">
                {loading ? (
                  <React.Fragment><svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" /></svg><span>Autenticando…</span></React.Fragment>
                ) : (
                  <React.Fragment><Icon name="user" className="h-5 w-5" /><span>Entrar con Passkey</span></React.Fragment>
                )}
              </button>
              <p className="text-center text-xs font-semibold text-slate-700">Biometría solo cuando sea necesario.</p>
            </div>
          ) : (
            <form onSubmit={fakeLogin} className="flex flex-col gap-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-brand-700">Nombre de usuario <span className="text-red-500">*</span></label>
                <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Tu nombre" className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-base font-semibold text-slate-800 shadow-soft outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-200" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-brand-700">Correo electrónico <span className="text-red-500">*</span></label>
                <input value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@correo.com" className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-base font-semibold text-slate-800 shadow-soft outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-200" />
              </div>
              <button type="submit" disabled={loading || !username.trim() || !email.trim()} className="flex w-full items-center justify-center gap-3 rounded-2xl bg-brand-600 px-4 py-4 text-lg font-extrabold text-white shadow-soft hover:bg-brand-700 active:scale-[0.99] disabled:opacity-60">
                <Icon name="user" className="h-5 w-5" /><span>Crear cuenta con Passkey</span>
              </button>
              <p className="text-center text-xs font-semibold text-slate-700">Face ID / huella para confirmar alta.</p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
window.LoginScreen = LoginScreen;
