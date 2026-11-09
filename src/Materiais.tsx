import { Central } from './useCentral';
import { Material, MaterialTipo } from './data';
import { Card, PageTitle, s } from './ui';
import { getToken } from './api';

const tipos: Record<MaterialTipo, { label: string; bg: string; fg: string; grad: string }> = {
  ebook: { label: 'E-BOOK', bg: '#EEF1F6', fg: '#0B2454', grad: 'linear-gradient(135deg,#0B2454,#0B2454)' },
  apresentacao: { label: 'APRESENTAÇÃO', bg: '#FFF7DE', fg: '#7A5A00', grad: 'linear-gradient(135deg,#7A3E00,#C77A12)' },
  planilha: { label: 'PLANILHA', bg: '#DCFCE7', fg: '#0B6B3F', grad: 'linear-gradient(135deg,#0B4A2E,#12985F)' },
  documento: { label: 'DOCUMENTO', bg: '#F1F3F8', fg: '#5B6478', grad: '#39415A' },
};

const ext = (src: string) => src.startsWith('demo:') ? 'EXEMPLO' : (src.split('?')[0].split('.').pop() || '').toUpperCase();
const tamanho = (b?: number) => (b == null ? '' : b >= 1048576 ? (b / 1048576).toFixed(1).replace('.', ',') + ' MB' : Math.max(1, Math.round(b / 1024)) + ' KB');
const comSessao = (src: string) => (src.startsWith('/materiais/') ? src + '?token=' + getToken() : src);
const baixar = (src: string) => comSessao(src) + (src.startsWith('/materiais/') ? '&' : src.includes('?') ? '&' : '?') + 'download=1';

function Cartao({ m, aviso }: { m: Material; aviso: () => void }) {
  const tp = tipos[m.tipo] || tipos.documento;
  const info = [ext(m.src), tamanho(m.bytes)].filter(Boolean).join(' · ');
  const btn = 'padding:10px 18px;border-radius:100px;font-size:12.5px;font-weight:700;cursor:pointer;display:inline-block;';
  return (
    <div style={s('background:#fff;border:1px solid #E9ECF3;border-radius:18px;overflow:hidden;display:flex;flex-direction:column')}>
      <div style={{ ...s('height:110px;display:flex;align-items:flex-end;justify-content:space-between;padding:16px'), background: tp.grad }}>
        <span style={s(`padding:5px 11px;border-radius:100px;background:${tp.bg};color:${tp.fg};font-size:10px;letter-spacing:.1em;font-weight:800`)}>{tp.label}</span>
        <span style={s('font-size:11px;font-weight:700;letter-spacing:.08em;color:rgba(255,255,255,.75)')}>{info}</span>
      </div>
      <div style={s('padding:20px 22px;display:flex;flex-direction:column;flex:1')}>
        <div style={s('font-size:15.5px;font-weight:700;line-height:1.35;margin-bottom:8px')}>{m.t}</div>
        <div style={s('font-size:12.5px;line-height:1.65;color:#7A8398;margin-bottom:18px;flex:1')}>{m.d}</div>
        <div style={s('display:flex;gap:10px')}>
          {m.src.startsWith('demo:') ? <>
            <span onClick={aviso} style={s(btn + 'background:#0B2454;color:#fff')}>Abrir</span>
            <span onClick={aviso} style={s(btn + 'background:#F1F3F8;border:1px solid #E5E8F0;color:#0B2454')}>Baixar</span>
          </> : <>
            <a href={comSessao(m.src)} target="_blank" rel="noopener noreferrer" style={s(btn + 'background:#0B2454;color:#fff')}>Abrir</a>
            <a href={baixar(m.src)} download style={s(btn + 'background:#F1F3F8;border:1px solid #E5E8F0;color:#0B2454')}>Baixar</a>
          </>}
        </div>
      </div>
    </div>
  );
}

export function Materiais({ c, embed }: { c: Central; embed?: boolean }) {
  return (
    <div style={{ maxWidth: 1180 }}>
      {!embed && <PageTitle title="Materiais" sub="E-books, apresentações e guias para consultar quando precisar." />}
      {c.materiais.length === 0 && (
        <Card pad="44px 40px" radius={20} style="text-align:center">
          <div style={s('font-size:18px;font-weight:700;margin-bottom:8px')}>Nenhum material publicado ainda</div>
          <div style={s('font-size:13.5px;line-height:1.7;color:#7A8398;max-width:460px;margin:0 auto')}>Os materiais digitais aparecem aqui assim que forem liberados.</div>
        </Card>
      )}
      <div style={s('display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px')}>
        {c.materiais.map(m => <Cartao key={m.id} m={m} aviso={() => c.showToast('Arquivo de exemplo: na versão real, o material abre ou baixa aqui')} />)}
      </div>
    </div>
  );
}
