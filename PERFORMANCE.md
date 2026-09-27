# Vesktop rendering check — 2026-09-27

Loaded the working-tree Ryoku.theme.css as the only enabled full theme, retaining bridge QuickCSS. Verified original mode visually and live mode in the running Discord renderer; the live accent resolved to the bridge’s current #d9d9d9. Both modes rendered the theme and artwork.

## Method

Used Electron’s local Chrome DevTools Protocol connection and Performance metrics. Each sample programmatically scrolled the largest visible scrollable list for five seconds using requestAnimationFrame, then restored its scroll position. Recorded frame intervals, layout/style counts and durations, and renderer task duration. These are main-thread animation callback intervals, not GPU-presented frame measurements. Other plugins and QuickCSS remained enabled. Changing the theme also changes viewport geometry.

The initial old/new/live comparison was contaminated by startup activity and navigation during capture, so it cannot establish a before/after speedup. A subsequent four-run control alternated no full theme and updated Ryoku.

| Full theme | Runs | Median frame interval | 95th percentile frame interval |
| --- | --- | --- | --- |
| None (QuickCSS/plugins remain) | 2 | 16.7 ms | 49.9–66.7 ms |
| Updated Ryoku, original palette | 2 | 16.7 ms | 50.0 ms |

Stutters occur with and without Ryoku. These short, variable samples do not prove a performance improvement or establish which component causes the stalls. They do show that remaining stalls cannot be attributed solely to the theme. A dedicated trace with an unchanged page and controlled plugin activity is needed before broader performance claims.

Raw local measurements: /tmp/ryoku-vesktop-profile/results.json and control-results.json. Screenshots are kept outside the repository because they include account content. The original enabled-theme selection is backed up in /tmp/ryoku-vesktop-profile/enabledThemes.before.json.
