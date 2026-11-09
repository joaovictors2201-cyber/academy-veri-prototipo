import { useCentral } from './useCentral';
import { Sso } from './Shell';
import { AppShell, Login } from './AppShell';
import { Inicio, Perfil, Trilhas } from './Catalog';
import { Certificado, Player, Quiz } from './Learning';
import { Config, Notificacoes } from './Office';
import { Setor } from './Setor';
import { Metodologia } from './Metodologia';
import { Operacao } from './Operacao';
import { Resultados } from './Resultados';
import { Intranet } from './Intranet';

export default function App() {
  const c = useCentral();
  if (c.screen === 'login' || !c.user && c.screen !== 'sso') return <Login c={c} />;
  if (c.screen === 'sso' || !c.user) return <Sso c={c} />;
  if (!c.setor) return <Setor c={c} />;
  return (
    <AppShell c={c}>
      {c.screen === 'inicio' && <Inicio c={c} />}
      {c.screen === 'trilhas' && <Trilhas c={c} />}
      {c.screen === 'metodologia' && <Metodologia c={c} />}
      {c.screen === 'operacao' && <Operacao c={c} />}
      {c.screen === 'resultados' && <Resultados c={c} />}
      {c.screen === 'intranet' && <Intranet c={c} />}
      {c.screen === 'player' && <Player c={c} />}
      {c.screen === 'quiz' && <Quiz c={c} />}
      {c.screen === 'perfil' && <Perfil c={c} />}
      {c.screen === 'certificado' && <Certificado c={c} />}
      {c.screen === 'notificacoes' && <Notificacoes />}
      {c.screen === 'config' && <Config c={c} />}
    </AppShell>
  );
}
