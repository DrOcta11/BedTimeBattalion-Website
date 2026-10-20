const VOICE_API_URL = 'https://btb-voice-api.tail890b5a.ts.net/api/voice';

const statusEl = document.getElementById('voice-status');
const updatedEl = document.getElementById('voice-updated');
const connectionEl = document.getElementById('voice-connection');
const connectionLabelEl = document.getElementById('voice-connection-label');
const musicToggleEl = document.getElementById('music-toggle');
const musicAudioEl = document.getElementById('music-audio');
const musicStatusEl = document.getElementById('music-status');
const yearEl = document.getElementById('year');

if (yearEl) yearEl.textContent = new Date().getFullYear();

if (musicToggleEl && musicAudioEl) {
  const updateMusicButton = (isPlaying) => {
    musicToggleEl.setAttribute('aria-pressed', String(isPlaying));
    musicToggleEl.innerHTML = isPlaying
      ? 'Sound stoppen <span aria-hidden="true">■</span>'
      : 'Sound starten <span aria-hidden="true">▶</span>';
  };

  const startMusic = async () => {
    try {
      await musicAudioEl.play();
      updateMusicButton(true);
      if (musicStatusEl) musicStatusEl.textContent = 'Tactical Confirmation läuft';
    } catch (error) {
      updateMusicButton(false);
      if (error.name === 'NotAllowedError') {
        if (musicStatusEl) musicStatusEl.textContent = 'Autoplay blockiert – zum Starten einmal klicken';
        console.info('Der Browser blockiert Audiostart mit Ton bis zur Nutzerinteraktion.');
      } else {
        if (musicStatusEl) musicStatusEl.textContent = 'Der Soundtrack konnte nicht gestartet werden';
        console.error('Audiowiedergabe fehlgeschlagen:', error);
      }
    }
  };

  musicAudioEl.volume = 0.24;
  musicAudioEl.addEventListener('error', () => {
    updateMusicButton(false);
    if (musicStatusEl) musicStatusEl.textContent = 'Die Audiodatei konnte nicht geladen werden';
    console.error('Audiodatei konnte nicht geladen werden:', musicAudioEl.error);
  });

  musicToggleEl.addEventListener('click', async () => {
    if (!musicAudioEl.paused) {
      musicAudioEl.pause();
      musicAudioEl.currentTime = 0;
      updateMusicButton(false);
      if (musicStatusEl) musicStatusEl.textContent = 'Soundtrack pausiert';
      return;
    }
    await startMusic();
  });
  startMusic();
}

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function renderVoice(data) {
  const channels = Array.isArray(data.channels) ? data.channels : [];

  if (!channels.length) {
    statusEl.innerHTML = `
      <div class="voice-empty">
        <strong>Gerade ist noch niemand im Voice.</strong><br>
        Sobald jemand einen Sprachkanal betritt, erscheint er hier automatisch.
      </div>`;
    return;
  }

  statusEl.innerHTML = channels.map(channel => {
    const channelName = escapeHtml(channel.name || 'Sprachkanal');
    const members = Array.isArray(channel.members) ? channel.members : [];
    const memberList = members.length
      ? `<ul class="voice-members">${members.map(member =>
        `<li class="voice-member">${escapeHtml(member.name || 'Discord-Mitglied')}</li>`
      ).join('')}</ul>`
      : '<p class="voice-no-members">Keine Mitglieder im Kanal.</p>';

    return `
      <article class="voice-channel">
        <h3 class="voice-channel-name">🔊 ${channelName}</h3>
        ${memberList}
      </article>`;
  }).join('');
}

function setConnectionState(state, label) {
  if (connectionEl) connectionEl.dataset.state = state;
  if (connectionLabelEl) connectionLabelEl.textContent = label;
}

async function loadDiscordVoice() {
  try {
    const response = await fetch(VOICE_API_URL, { cache: 'no-store' });
    if (!response.ok) throw new Error(`Voice-API HTTP ${response.status}`);

    const data = await response.json();
    if (!data || !Array.isArray(data.channels)) {
      throw new Error('Ungültige Antwort der Voice-API');
    }
    renderVoice(data);
    setConnectionState('live', 'LIVE');

    if (updatedEl) {
      updatedEl.textContent = `Zuletzt aktualisiert: ${new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`;
    }
  } catch (error) {
    statusEl.innerHTML = `
      <div class="voice-error">
        <strong>Voice-Liveanzeige momentan nicht verfügbar.</strong><br>
        Die Verbindung zur Bot-Voice-API ist momentan nicht verfügbar.
      </div>`;
    setConnectionState('error', 'OFFLINE');
    if (updatedEl) updatedEl.textContent = 'Bot-Liveverbindung nicht verfügbar';
    console.error(error);
  }
}

loadDiscordVoice();
setInterval(loadDiscordVoice, 30000);
