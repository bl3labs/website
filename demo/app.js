const DEFAULT_AGENT = 'agent_2901m2zfr7qxegft77e97qyecx54';
const DEFAULT_BRANCH = 'agtbrch_4201m2zfr8ptegx8tnkrn0x1fx1m';
const query = new URLSearchParams(location.search);
const validAgent = value => /^agent_[a-zA-Z0-9_-]{1,100}$/.test(value);
const validBranch = value => /^agtbrch_[a-zA-Z0-9_-]{1,100}$/.test(value);
const customAgent = query.has('agent');
const agentId = customAgent ? query.get('agent') : DEFAULT_AGENT;
const branchId = query.get('branch') || (customAgent ? '' : DEFAULT_BRANCH);
const name = (query.get('name') || 'Leonie').trim().slice(0,60) || 'Leonie';
const company = (query.get('company') || '').trim().slice(0,100);
const configured = validAgent(agentId) && (!branchId || validBranch(branchId));
const $ = id => document.getElementById(id);
const start = $('start'), end = $('end'), mute = $('mute'), consent = $('consent');
let session = null, generation = 0, pending = false, muted = false;
let state = 'idle', startedAt = 0, timer = null, sdkPromise, controller;
let remoteFailure = false;

$('agent-name').textContent = name;
$('headline').textContent = `Lernen Sie ${name} kennen.`;
$('company').textContent = company;
$('company').hidden = !company;
document.title = `${name} · BL3LABS Live-Demo`;

function setState(next, message) {
  state = next;
  $('card').dataset.state = next;
  $('status').textContent = message;
  const active = next === 'connected';
  const busy = next === 'connecting' || next === 'ending';
  $('consent-area').hidden = active || busy;
  start.hidden = active || busy;
  start.disabled = !consent.checked || !configured || pending;
  end.hidden = !active && next !== 'connecting';
  end.disabled = next === 'ending';
  $('end-label').textContent = next === 'connecting' ? 'Abbrechen' : 'Gespräch beenden';
  mute.hidden = !active;
  mute.disabled = !session;
  $('timer').hidden = !active;
  $('mic-note').hidden = active || busy;
  $('controls').setAttribute('aria-busy', String(busy));
}
function reset(message) {
  clearInterval(timer);
  timer = null;
  muted = false;
  mute.setAttribute('aria-pressed','false');
  mute.setAttribute('aria-label','Mikrofon stummschalten');
  $('mute-label').textContent = 'Stummschalten';
  $('timer').textContent = '00:00';
  consent.checked = false;
  setState('idle',message);
}
function updateTimer() {
  const seconds = Math.floor((Date.now()-startedAt)/1000);
  $('timer').textContent = `${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(seconds%60).padStart(2,'0')}`;
}
function connected() {
  if (state !== 'connected') {
    startedAt = Date.now();
    updateTimer();
    timer = setInterval(updateTimer,1000);
  }
  setState('connected', `${name} ist für Sie da.`);
}
async function stop(message = 'Gespräch beendet. Bis zum nächsten Mal!') {
  generation++;
  controller?.abort();
  const active = session;
  session = null;
  clearInterval(timer);
  setState('ending','Gespräch wird beendet …');
  try { if (active) await active.endSession(); }
  catch { message = 'Die Verbindung wurde getrennt. Sie können ein neues Gespräch starten.'; }
  finally { reset(message); }
}
async function loadSDK() {
  sdkPromise ??= import('https://esm.sh/@elevenlabs/client@1.25.0?bundle').catch(error => {
    sdkPromise = null;
    throw error;
  });
  return sdkPromise;
}
async function begin() {
  if (!consent.checked || !configured || pending || session || state !== 'idle') return;
  const current = ++generation;
  const consentAt = new Date().toISOString();
  pending = true;
  remoteFailure = false;
  setState('connecting','Bitte erlauben Sie den Mikrofonzugriff …');
  try {
    if (!navigator.mediaDevices?.getUserMedia) throw new Error('microphone-unavailable');
    const stream = await navigator.mediaDevices.getUserMedia({audio:true});
    stream.getTracks().forEach(track => track.stop());
    if (current !== generation) return;
    $('status').textContent = 'Verbindung wird hergestellt …';
    const {Conversation} = await loadSDK();
    if (current !== generation) return;
    controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(),15000);
    const params = new URLSearchParams({agent_id:agentId});
    if (branchId) params.set('branch_id',branchId);
    let response;
    try {
      response = await fetch(`https://api.elevenlabs.io/v1/convai/conversation/token?${params}`,{signal:controller.signal});
    } finally { clearTimeout(timeout); }
    if (!response.ok) throw new Error('connection-unavailable');
    const {token} = await response.json();
    if (!token) throw new Error('connection-unavailable');
    if (current !== generation) return;
    const active = await Conversation.startSession({
      conversationToken:token,
      connectionType:'webrtc',
      dynamicVariables:{demo_consent:'true',demo_consent_at:consentAt,demo_consent_version:'bl3-demo-2026-10-11'},
      onConnect:() => { if (current === generation) connected(); },
      onModeChange:({mode}) => {
        if (current !== generation || state !== 'connected') return;
        $('card').dataset.mode = mode;
        $('status').textContent = muted ? 'Ihr Mikrofon ist stummgeschaltet.' : mode === 'speaking' ? `${name} spricht …` : `${name} hört Ihnen zu …`;
      },
      onDisconnect:() => {
        if (current !== generation) return;
        session = null;
        generation++;
        reset(remoteFailure ? 'Die Verbindung wurde unterbrochen. Bitte versuchen Sie es erneut.' : 'Das Gespräch wurde beendet. Vielen Dank fürs Ausprobieren!');
      },
      onError:() => {
        if (current !== generation) return;
        remoteFailure = true;
        if (state === 'connected') void stop('Die Verbindung wurde unterbrochen. Bitte versuchen Sie es erneut.');
        else { generation++; reset('Die Verbindung konnte nicht hergestellt werden. Bitte versuchen Sie es erneut.'); }
      }
    });
    if (current !== generation) { await active.endSession(); return; }
    session = active;
    if (state !== 'connected') connected();
    mute.disabled = false;
  } catch(error) {
    if (current !== generation) return;
    reset(error.name === 'NotAllowedError'
      ? 'Bitte erlauben Sie den Mikrofonzugriff in Ihrem Browser und versuchen Sie es erneut.'
      : error.name === 'NotFoundError' || error.message === 'microphone-unavailable'
      ? 'Kein Mikrofon verfügbar. Bitte verwenden Sie einen Browser mit Mikrofonzugriff.'
      : error.name === 'NotReadableError'
      ? 'Ihr Mikrofon ist nicht verfügbar. Bitte prüfen Sie, ob eine andere Anwendung es verwendet.'
      : 'Die Verbindung konnte nicht hergestellt werden. Bitte versuchen Sie es erneut.');
  } finally {
    pending = false;
    start.disabled = !consent.checked || !configured;
  }
}
consent.addEventListener('change',() => {start.disabled = !consent.checked || !configured || pending;});
start.addEventListener('click',begin);
end.addEventListener('click',() => void stop(state === 'connecting' ? 'Verbindungsaufbau abgebrochen.' : undefined));
mute.addEventListener('click',() => {
  if (!session || state !== 'connected') return;
  try {
    session.setMicMuted(!muted);
    muted = !muted;
    mute.setAttribute('aria-pressed',String(muted));
    mute.setAttribute('aria-label',muted ? 'Mikrofon einschalten' : 'Mikrofon stummschalten');
    $('mute-label').textContent = muted ? 'Mikrofon einschalten' : 'Stummschalten';
    $('status').textContent = muted ? 'Ihr Mikrofon ist stummgeschaltet.' : `${name} hört Ihnen zu …`;
  } catch { $('status').textContent = 'Das Mikrofon konnte nicht umgeschaltet werden.'; }
});
window.addEventListener('pagehide',() => { void stop(); });
const privacy = $('privacy');
document.querySelectorAll('[data-privacy]').forEach(button => button.addEventListener('click',() => privacy.showModal()));
$('privacy-close').addEventListener('click',() => privacy.close());
privacy.addEventListener('click',event => { if (event.target === privacy) privacy.close(); });
reset(configured ? 'Bereit für Ihr Gespräch' : 'Dieser Demo-Link ist ungültig. Bitte kontaktieren Sie BL3LABS.');
