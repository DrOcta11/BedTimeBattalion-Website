const GUILD_ID = '1546613563215585320';
const WIDGET_URL = `https://discord.com/api/guilds/${GUILD_ID}/widget.json`;

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
  const members = Array.isArray(data.members) ? data.members : [];

  const occupied = channels
    .map(channel => ({
      ...channel,
      members: members.filter(member => member.channel_id === channel.id)
    }))
    .filter(channel => channel.members.length > 0)
    .sort((a, b) => (a.position ?? 0) - (b.position ?? 0));

  if (!occupied.length) {
    statusEl.innerHTML = `
      <div class="voice-empty">
        <strong>Gerade ist noch niemand im Voice.</strong><br>
        Sobald jemand einen sichtbaren Sprachkanal betritt, erscheint er hier automatisch.
      </div>`;
    return;
  }

  statusEl.innerHTML = occupied.map(channel => {
    const memberCards = channel.members.map(member => {
      const name = escapeHtml(member.nick || member.username || 'Discord-Mitglied');
      const avatar = member.avatar_url
        ? `<img src="${escapeHtml(member.avatar_url)}" alt="Avatar von ${name}" loading="lazy">`
        : `<span class="voice-avatar-fallback">${name.slice(0, 1).toUpperCase()}</span>`;

      return `<div class="voice-member">${avatar}<span class="voice-member-name">${name}</span></div>`;
    }).join('');

    return `
      <article class="voice-channel">
        <div class="voice-channel-head">
          <span class="voice-channel-name">🔊 ${escapeHtml(channel.name)}</span>
          <span class="voice-channel-count">${channel.members.length} ${channel.members.length === 1 ? 'Person' : 'Personen'}</span>
        </div>
        <div class="voice-members">${memberCards}</div>
      </article>`;
  }).join('');
}

async function loadDiscordVoice() {
  try {
    const response = await fetch(WIDGET_URL, { cache: 'no-store' });
    if (!response.ok) throw new Error(`Discord Widget HTTP ${response.status}`);

    const data = await response.json();
    renderVoice(data);

    if (updatedEl) {
      updatedEl.textContent = `Zuletzt aktualisiert: ${new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`;
    }
  } catch (error) {
    statusEl.innerHTML = `
      <div class="voice-error">
        <strong>Voice-Liveanzeige momentan nicht verfügbar.</strong><br>
        Prüfe bitte in Discord unter Servereinstellungen → Widget, ob das Server-Widget aktiviert ist.
      </div>`;
    if (updatedEl) updatedEl.textContent = 'Discord-Liveverbindung nicht verfügbar';
    console.error(error);
  }
}

loadDiscordVoice();
setInterval(loadDiscordVoice, 30000);
