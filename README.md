# BedTimeBattalion-Website
bedtimebattalion-website

## Voice-Live-Daten

Die Homepage ruft die öffentliche Voice-only-API über Tailscale Funnel ab:

`https://btb-voice-api.tail890b5a.ts.net/api/voice`

Der VPS veröffentlicht über Funnel ausschließlich den lokalen Voice-Proxy auf Port `8091`; das Bot-Dashboard bleibt auf `127.0.0.1:8090` beschränkt. Die API gibt aktuelle, belegte Sprachkanäle und deren Anzeigenamen zurück. Die Homepage aktualisiert die Anzeige automatisch alle 30 Sekunden.

## BTB-Soundtrack

`assets/btb-tactical-confirmation.mp3` wird beim Laden mit niedriger Lautstärke und in einer Schleife abgespielt. Browser können Autoplay mit Ton blockieren; in dem Fall kann der Besucher den Track über den sichtbaren Schalter starten oder stoppen. Der YouTube-Clip `4D2JTuaMczs` ist als Soundtrack der aktuellen Season eingebettet, startet stumm und zeigt Player-Steuerungen an.
