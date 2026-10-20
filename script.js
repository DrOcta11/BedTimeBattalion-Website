const VOICE_API_URL = 'https://btb-voice-api.tail890b5a.ts.net/api/voice';

const statusEl = document.getElementById('voice-status');
const updatedEl = document.getElementById('voice-updated');
const yearEl = document.getElementById('year');

if (yearEl) yearEl.textContent = new Date().getFullYear();

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

async function loadDiscordVoice() {
  try {
    const response = await fetch(VOICE_API_URL, { cache: 'no-store' });
    if (!response.ok) throw new Error(`Voice-API HTTP ${response.status}`);

    const data = await response.json();
    if (!data || !Array.isArray(data.channels)) {
      throw new Error('Ungültige Antwort der Voice-API');
    }
    renderVoice(data);

    if (updatedEl) {
      updatedEl.textContent = `Zuletzt aktualisiert: ${new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`;
    }
  } catch (error) {
    statusEl.innerHTML = `
      <div class="voice-error">
        <strong>Voice-Liveanzeige momentan nicht verfügbar.</strong><br>
        Die Verbindung zur Bot-Voice-API ist momentan nicht verfügbar.
      </div>`;
    if (updatedEl) updatedEl.textContent = 'Bot-Liveverbindung nicht verfügbar';
    console.error(error);
  }
}

loadDiscordVoice();
setInterval(loadDiscordVoice, 30000);
