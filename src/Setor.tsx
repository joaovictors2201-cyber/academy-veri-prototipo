import { Central } from './useCentral';
import { s } from './ui';

const LOGO_L = import.meta.env.BASE_URL + 'assets/logo-veri-academy-light.png';

const SETORES = [
  { id: 'comercial', nome: 'Comercial', d: 'SDR, consultores e liderança comercial', ativo: true },
  { id: 'marketing', nome: 'Marketing', d: 'Campanhas, conteúdo e eventos', ativo: false },
  { id: 'suporte', nome: 'Suporte', d: 'Atendimento e sucesso do cliente', ativo: false },
  { id: 'pessoas', nome: 'Pessoas e RH', d: 'Cultura, treinamentos e rotinas internas', ativo: false },
];

/** Primeira entrada: a pessoa escolhe o setor. Só o Comercial está aberto por enquanto. */
export function Setor({ c }: { c: Central }) {
  return (
    <div style={s('min-height:100vh;display:flex;align-items:center;justify-content:center;background:radial-gradient(1100px 620px at 50% -10%,#0B2454 0%,#0B2454 55%,#0B2454 100%)')}>
      <div style={s('width:640px;padding:48px 44px;border-radius:24px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.14);animation:veriUp .5s ease both')}>
        <img src={LOGO_L} alt="VERI Academy" style={s('height:30px;margin-bottom:30px')} />
        <div style={s('font-size:11px;letter-spacing:.2em;font-weight:700;color:rgba(255,255,255,.72);margin-bottom:12px')}>BEM-VINDO(A), {c.user?.nome.split(' ')[0].toUpperCase()}</div>
        <div style={s('font-size:24px;font-weight:700;color:#fff;line-height:1.3;margin-bottom:10px')}>Em qual setor você trabalha?</div>
        <div style={s('font-size:14px;line-height:1.65;color:rgba(255,255,255,.62);margin-bottom:24px')}>Cada setor tem a sua metodologia, a sua rotina e os seus resultados. Você pode trocar depois.</div>
        <div style={s('display:grid;grid-template-columns:1fr 1fr;gap:12px')}>
          {SETORES.map(x => (
            <div key={x.id} onClick={() => (x.ativo ? c.setSetor(x.id) : c.showToast(`${x.nome}: em breve`))}
              style={{ ...s(`padding:18px 20px;border-radius:16px;cursor:${x.ativo ? 'pointer' : 'not-allowed'};${x.ativo ? 'background:#fff;color:#0B2454' : 'background:rgba(255,255,255,.08);color:rgba(255,255,255,.55);border:1px solid rgba(255,255,255,.14)'}`) }}>
              <div style={s('display:flex;align-items:center;gap:8px;font-size:15.5px;font-weight:800;margin-bottom:4px')}>{x.nome}{!x.ativo && <span style={s('font-size:9.5px;letter-spacing:.1em;font-weight:800;padding:3px 8px;border-radius:100px;background:rgba(255,255,255,.14)')}>EM BREVE</span>}</div>
              <div style={s('font-size:12.5px;line-height:1.5;opacity:.8')}>{x.d}</div>
            </div>
          ))}
        </div>
        {c.toast && <div style={s('margin-top:16px;font-size:13px;color:rgba(255,255,255,.8)')}>{c.toast}</div>}
      </div>
    </div>
  );
}
