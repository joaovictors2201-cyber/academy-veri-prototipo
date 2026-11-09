import { useState } from 'react';
import { Central } from './useCentral';
import { Bar, Card, s } from './ui';
import { ItemOp } from './demo';
import { loadOperacao, saveOperacao } from './store';

/** Checklist de rotina do dia. Editável: dá para incluir, renomear e excluir itens. As marcações zeram a cada dia. */
export function Operacao({ c }: { c: Central }) {
  const [itens, setItens] = useState<ItemOp[]>(() => loadOperacao());
  const [editar, setEditar] = useState(false);
  const [novo, setNovo] = useState('');
  const [hora, setHora] = useState('');
  const salvar = (l: ItemOp[]) => { setItens(l); saveOperacao(l); };
  const feitos = itens.filter(i => i.ok).length;
  const pct = itens.length ? Math.round((feitos / itens.length) * 100) : 0;
  const campo = 'padding:10px 14px;border-radius:10px;border:1px solid #E5E8F0;background:#fff;font-size:13.5px;outline:none;color:#0F172A';
  const hoje = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
  return (
    <div style={{ maxWidth: 900 }}>
      <div style={s('font-size:24px;font-weight:800;letter-spacing:-.01em;margin-bottom:5px')}>Operação</div>
      <div style={s('font-size:13.5px;color:#7A8398;margin-bottom:20px')}>Sua rotina de hoje, {hoje}. Marque cada item ao concluir. As marcações recomeçam todo dia.</div>
      <Card style="margin-bottom:18px">
        <div style={s('display:flex;align-items:center;gap:16px;margin-bottom:10px')}>
          <div style={s('font-size:30px;font-weight:800;color:#0B2454')}>{feitos}/{itens.length}</div>
          <div style={{ flex: 1, fontSize: 13, color: '#7A8398' }}>{pct === 100 ? 'Rotina do dia concluída.' : 'itens concluídos hoje'}</div>
          <div onClick={() => setEditar(e => !e)} style={s(`cursor:pointer;padding:9px 18px;border-radius:100px;font-size:12.5px;font-weight:700;${editar ? 'background:#0B2454;color:#fff' : 'background:#fff;border:1px solid #D6DBE6;color:#0B2454'}`)}>{editar ? 'Concluir edição' : 'Editar lista'}</div>
        </div>
        <Bar pct={pct + '%'} h={8} />
      </Card>
      <Card pad="8px 22px">
        {itens.length === 0 && <div style={s('padding:20px 0;font-size:13.5px;color:#7A8398')}>Nenhum item. Use "Editar lista" para incluir.</div>}
        {itens.map((it, i) => (
          <div key={it.id} style={s(`display:flex;align-items:center;gap:14px;padding:14px 0;${i ? 'border-top:1px solid #F0F2F7' : ''}`)}>
            <input type="checkbox" checked={it.ok} onChange={e => salvar(itens.map(x => (x.id === it.id ? { ...x, ok: e.target.checked } : x)))} style={{ width: 18, height: 18, cursor: 'pointer' }} />
            {it.h && !editar && <span style={s('font-size:12px;font-weight:800;color:#0B2454;background:#EEF1F6;padding:4px 10px;border-radius:100px;min-width:58px;text-align:center')}>{it.h}</span>}
            {editar
              ? <>
                <input value={it.h || ''} onChange={e => salvar(itens.map(x => (x.id === it.id ? { ...x, h: e.target.value } : x)))} placeholder="Hora" style={{ ...s(campo), width: 80 }} />
                <input value={it.t} onChange={e => salvar(itens.map(x => (x.id === it.id ? { ...x, t: e.target.value } : x)))} style={{ ...s(campo), flex: 1 }} />
                <span onClick={() => salvar(itens.filter(x => x.id !== it.id))} style={s('cursor:pointer;font-size:12.5px;font-weight:700;color:#B42318')}>Excluir</span>
              </>
              : <span style={{ flex: 1, fontSize: 14.5, fontWeight: 600, textDecoration: it.ok ? 'line-through' : 'none', opacity: it.ok ? 0.55 : 1 }}>{it.t}</span>}
          </div>
        ))}
      </Card>
      {editar && (
        <Card style="margin-top:14px" pad="16px 20px">
          <div style={s('font-size:14px;font-weight:700;margin-bottom:10px')}>Incluir item</div>
          <div style={s('display:flex;gap:10px')}>
            <input value={hora} onChange={e => setHora(e.target.value)} placeholder="Hora (opcional)" style={{ ...s(campo), width: 130 }} />
            <input value={novo} onChange={e => setNovo(e.target.value)} placeholder="Ex.: Revisar propostas abertas" style={{ ...s(campo), flex: 1 }} />
            <div onClick={() => { if (!novo.trim()) return; salvar([...itens, { id: 'o' + Date.now(), h: hora.trim() || undefined, t: novo.trim(), ok: false }]); setNovo(''); setHora(''); c.showToast('Item incluído'); }}
              style={s('cursor:pointer;padding:10px 20px;border-radius:100px;background:#0B2454;color:#fff;font-size:13px;font-weight:700')}>Incluir</div>
          </div>
        </Card>
      )}
    </div>
  );
}
