# BedTimeBattalion-Website
bedtimebattalion-website

## Voice-Live-Daten

Die Homepage ruft die öffentliche Voice-only-API über Tailscale Funnel ab:

`https://btb-voice-api.tail890b5a.ts.net/api/voice`

Der VPS veröffentlicht über Funnel ausschließlich den lokalen Voice-Proxy auf Port `8091`; das Bot-Dashboard bleibt auf `127.0.0.1:8090` beschränkt. Die API gibt aktuelle, belegte Sprachkanäle und deren Anzeigenamen zurück. Die Homepage aktualisiert die Anzeige automatisch alle 30 Sekunden.
