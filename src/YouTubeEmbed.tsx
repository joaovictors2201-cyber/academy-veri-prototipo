import { useEffect, useRef } from 'react';
import { Central } from './useCentral';

/**
 * Vídeo do YouTube dentro da plataforma (player incorporado, domínio youtube-nocookie).
 * O tempo assistido e o progresso vêm do próprio player (mensagens da API de iframe do YouTube):
 * só contam com reprodução contínua (pular para a frente não soma) e, a partir de 90%, a aula conclui.
 * `trackKey` é o id sob o qual o progresso e as métricas são gravados (ex.: id do vídeo ou "ws:<id>").
 */
export function YouTubeEmbed({ c, ytId, trackKey, title }: { c: Central; ytId: string; trackKey: string; title: string }) {
  const frame = useRef<HTMLIFrameElement>(null);
  const st = useRef({ last: -1, max: 0, dur: 0, playing: false, pct: -1 });
  const { trackWatch, reportProgress } = c;

  useEffect(() => {
    st.current = { last: -1, max: 0, dur: 0, playing: false, pct: -1 };
    const onMsg = (e: MessageEvent) => {
      let host = '';
      try { host = new URL(e.origin).hostname; } catch { return; }
      if (!/(^|\.)youtube(-nocookie)?\.com$/.test(host) || e.source !== frame.current?.contentWindow) return;
      let d: { event?: string; info?: { currentTime?: number; duration?: number; playerState?: number } | number };
      try { d = typeof e.data === 'string' ? JSON.parse(e.data) : e.data; } catch { return; }
      const info = typeof d.info === 'object' ? d.info : undefined;
      const S = st.current;
      if (d.event === 'onStateChange' && typeof d.info === 'number') S.playing = d.info === 1;
      if (!info) return;
      if (typeof info.playerState === 'number') S.playing = info.playerState === 1;
      if (typeof info.duration === 'number' && info.duration > 0) S.dur = info.duration;
      if (typeof info.currentTime === 'number') {
        const t = info.currentTime;
        if (S.playing && S.last >= 0) {
          const dt = t - S.last;
          if (dt > 0 && dt < 2.5) { trackWatch(trackKey, dt); if (t > S.max && t - S.max < 3) S.max = t; }
        } else if (S.playing && S.max === 0 && t < 3) S.max = t;
        S.last = t;
        if (S.dur) { const p = Math.floor(Math.min(100, (S.max / S.dur) * 100)); if (p !== S.pct) { S.pct = p; reportProgress(trackKey, p); } }
      }
      if (info.playerState === 0 && S.dur) { S.max = S.dur; S.pct = 100; reportProgress(trackKey, 100); }
    };
    window.addEventListener('message', onMsg);
    return () => window.removeEventListener('message', onMsg);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ytId, trackKey]);

  const handshake = () => {
    const win = frame.current?.contentWindow;
    if (!win) return;
    win.postMessage(JSON.stringify({ event: 'listening', id: 1, channel: 'widget' }), '*');
    win.postMessage(JSON.stringify({ event: 'command', func: 'addEventListener', args: ['onStateChange'], id: 1, channel: 'widget' }), '*');
  };

  return (
    <iframe
      key={ytId} ref={frame} onLoad={handshake} title={title}
      src={`https://www.youtube-nocookie.com/embed/${ytId}?enablejsapi=1&rel=0&hl=pt-BR&playsinline=1&origin=${encodeURIComponent(window.location.origin)}`}
      allow="accelerometer; encrypted-media; picture-in-picture; fullscreen" referrerPolicy="strict-origin-when-cross-origin"
      style={{ width: '100%', aspectRatio: '16/9', border: 0, display: 'block', background: '#000' }}
    />
  );
}
