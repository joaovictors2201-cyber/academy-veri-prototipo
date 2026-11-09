import { useEffect, useRef, useState } from 'react';
import { Central } from './useCentral';
import { VideoFull } from './data';
import { s } from './ui';
import { getToken } from './api';
import { YouTubeEmbed } from './YouTubeEmbed';
import { youtubeId } from './data';

/**
 * Player real. O progresso só avança com reprodução contínua: pular para frente além do
 * ponto já assistido é bloqueado (enquanto a aula não está concluída) e a velocidade fica em 1x.
 * Conta como concluído a partir de 90% (regra no hook). Retoma de onde a pessoa parou.
 */
const mediaUrl = (u: string) => (u.startsWith('/media/') ? `${u}?token=${getToken()}` : u);

export function VideoPlayer({ c, v }: { c: Central; v: VideoFull }) {
  const ref = useRef<HTMLVideoElement>(null);
  const max = useRef(0);          // maior ponto (s) assistido sem pular
  const lastPct = useRef(-1);
  const dur = useRef(0);
  const lastT = useRef(0);
  const wasDone = useRef(!!c.done[v.id]);
  const [note, setNote] = useState('');
  const doneNow = !!c.done[v.id];
  if (doneNow) wasDone.current = true; // concluída: liberado para rever/pular

  useEffect(() => {
    max.current = 0; lastPct.current = -1; dur.current = 0; wasDone.current = !!c.done[v.id]; setNote('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [v.id]);

  const report = (force = false) => {
    if (!dur.current || wasDone.current) return;
    const pct = Math.min(100, (max.current / dur.current) * 100);
    const fl = Math.floor(pct);
    if (force || fl !== lastPct.current) { lastPct.current = fl; c.reportProgress(v.id, pct); }
  };

  useEffect(() => () => { report(true); /* salva o ponto exato ao sair da aula */ });

  if (v.locked) {
    return (
      <div style={s('border-radius:16px;overflow:hidden;background:#091730')}>
        <div style={s('aspect-ratio:16/9;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;background:radial-gradient(700px 320px at 50% 40%,#0B2454 0%,#091730 80%);color:rgba(255,255,255,.8);text-align:center;padding:24px')}>
          <div style={s('font-size:16px;font-weight:700;color:#fff')}>Vídeo bloqueado</div>
          <div style={s('font-size:13px;max-width:360px;line-height:1.6')}>Este conteúdo é exclusivo da equipe da área. Fale com o administrador se você deveria ter acesso.</div>
        </div>
      </div>
    );
  }

  const yt = youtubeId(v.youtube);
  if (yt && !v.locked) {
    return (
      <div style={s('border-radius:16px;overflow:hidden;background:#000;position:relative')}>
        <YouTubeEmbed c={c} ytId={yt} trackKey={v.id} title={v.t} />
        {doneNow && <span style={s('position:absolute;top:16px;left:16px;padding:7px 14px;border-radius:100px;background:#DCFCE7;color:#0B6B3F;font-size:10.5px;letter-spacing:.09em;font-weight:800;pointer-events:none')}>✓ AULA CONCLUÍDA</span>}
      </div>
    );
  }

  if (!v.src) {
    return (
      <div style={s('border-radius:16px;overflow:hidden;background:#091730')}>
        <div style={s('aspect-ratio:16/9;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;background:radial-gradient(700px 320px at 50% 40%,#0B2454 0%,#091730 80%);color:rgba(255,255,255,.8);text-align:center;padding:24px')}>
          <div style={s('font-size:16px;font-weight:700;color:#fff')}>Vídeo em preparação</div>
          <div style={s('font-size:13px;max-width:360px;line-height:1.6')}>Esta aula ainda não foi publicada. Assim que o vídeo estiver no ar, você poderá assistir aqui.</div>
        </div>
      </div>
    );
  }

  return (
    <div style={s('border-radius:16px;overflow:hidden;background:#091730;position:relative')}>
      <video
        key={v.id} ref={ref} src={mediaUrl(v.src)} poster={v.poster} controls controlsList="nodownload noplaybackrate" disablePictureInPicture playsInline preload="metadata"
        style={s('width:100%;aspect-ratio:16/9;display:block;background:#091730')}
        onLoadedMetadata={e => {
          const el = e.currentTarget;
          dur.current = el.duration;
          if (!wasDone.current) {
            const startPct = c.pos[v.id] || 0;
            const t = startPct >= 98 ? 0 : (startPct / 100) * el.duration;
            max.current = t; el.currentTime = t;
          }
        }}
        onTimeUpdate={e => {
          const el = e.currentTarget;
          if (!el.seeking && !el.paused) { const dt = el.currentTime - lastT.current; if (dt > 0 && dt < 2) c.trackWatch(v.id, dt); }
          lastT.current = el.currentTime;
          if (wasDone.current || el.seeking) return;
          // só avança o "máximo assistido" em reprodução contínua (saltos > 3 s não contam)
          if (el.currentTime > max.current && el.currentTime - max.current < 3) max.current = el.currentTime;
          report();
        }}
        onSeeking={e => {
          const el = e.currentTarget;
          if (!wasDone.current && el.currentTime > max.current + 1) {
            el.currentTime = max.current;
            setNote('Para concluir a aula, assista sem pular partes.');
            window.setTimeout(() => setNote(''), 2600);
          }
        }}
        onRateChange={e => { if (!wasDone.current && e.currentTarget.playbackRate !== 1) e.currentTarget.playbackRate = 1; }}
        onPause={() => report(true)}
        onEnded={e => {
          if (!wasDone.current) { max.current = e.currentTarget.duration; report(true); }
        }}
      >
        {v.legenda && <track kind="captions" srcLang="pt-BR" label="Português (automática)" src={mediaUrl(v.legenda)} default />}
      </video>
      {doneNow && <span style={s('position:absolute;top:16px;left:16px;padding:7px 14px;border-radius:100px;background:#DCFCE7;color:#0B6B3F;font-size:10.5px;letter-spacing:.09em;font-weight:800;pointer-events:none')}>✓ AULA CONCLUÍDA</span>}
      {note && <div style={s('position:absolute;left:50%;bottom:64px;transform:translateX(-50%);padding:9px 16px;border-radius:100px;background:rgba(15,23,42,.9);color:#fff;font-size:12.5px;font-weight:600;pointer-events:none')}>{note}</div>}
    </div>
  );
}
