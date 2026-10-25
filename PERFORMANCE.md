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

## Optimization benchmarks — 2026-10-17

Measured Chromium rendering pipeline metrics via Chrome DevTools Protocol (`Performance.getMetrics`) comparing the original theme (`Sipper1236/ryoku-discord @ b8e35b3`) against the optimized theme across representative Discord DOM structures.

### Test 1: Sidebar Hovering (6 hover/unhover cycles across channels)
Replaced `margin-left` layout animation with composite-only `translate`.

| Metric | Original (`b8e35b3`) | Optimized | Change |
| --- | --- | --- | --- |
| Layout recalculations | 419–422 | 62–64 | **~85% fewer layouts** |
| Layout duration | 164.9–169.5 ms | 19.3–20.7 ms | **~88% faster layout time** |
| Style recalculations | 420–423 | 238–241 | **~43% fewer recalculations** |
| Total renderer task duration | 2,353–2,388 ms | 1,779–1,893 ms | **~23% reduction (~540 ms saved)** |

### Test 2: Channel Switching (6 simulated chat mounts)
Replaced `[class*="messagesWrapper"]` 380ms blur/scale/movement animation with a pure opacity fade (`chat-fade-in`).

| Metric | Original (`b8e35b3`) | Optimized | Change |
| --- | --- | --- | --- |
| Style recalculations | 37–39 | 12–14 | **~66% fewer recalculations** |
| Style recalculation time | 69.3–103.0 ms | 50.5–52.3 ms | **~35–50% faster style calculation** |
| Total renderer task duration | 148.4–245.7 ms | 94.6–101.6 ms | **~45–60% faster task duration** |

### Test 3: Message Sending & Dynamic Rows (15 message updates)
Removed `li[id^="chat-messages-"]:has(...)` queries and sending blur filter.

| Metric | Original (`b8e35b3`) | Optimized | Change |
| --- | --- | --- | --- |
| Style recalculations | 45 | 21–22 | **~52% fewer recalculations** |
| Style recalculation time | 35.8–37.3 ms | 16.5–16.9 ms | **~54% faster style calculation** |
| Total renderer task duration | 95.6–102.8 ms | 50.6–55.2 ms | **~47% faster task duration** |

## Layout animation cleanup — 2026-10-25

The upstream v3 stylesheet still animated channel, member, DM, and settings-list
hover movement with `margin-left`, which changes layout during each transition.
The build now uses the independent `translate` property for those movements,
and no longer sets permanent `will-change: margin-left` hints. The broad
`[class*='scroll'] { will-change: scroll-position }` rule was also removed to
avoid pre-promoting every element whose class name contains “scroll”. Each
installable theme variant includes matching post-import overrides, so these
changes apply even while its base stylesheet is loaded from the upstream host.

This should reduce hover-triggered layout work and unnecessary layer promotion.
The change has not yet been benchmarked against the merged upstream v3 theme;
the 2026-10-17 figures above describe the older theme and should not be treated
as measurements of this update.

## List entrance cleanup — 2026-10-25

Friends and message requests now fade once per list surface instead of using an
animated inherited custom property to start staggered animations on every row.
This removes the row-count-dependent entrance animations and the inherited gate
mechanism. The visual change is a short whole-list fade instead of staggered rows.
Both the global animation switch and the individual feature switches apply;
reduced motion disables these fades. Matching overrides ship in all seven
installable variants because they import the upstream hosted base.

Timed shop-card entrances use backwards fill so their translate and scale
values are released when the entrance ends. Scroll-driven shop reveals retain
their fill behavior. These changes have no measured live Discord speedup yet.

Chromium headless fixture checks used 60 friends and 60 request rows against
upstream `8637576`, the modified build, and each installable variant's overrides.
Upstream assigned entrance animations to all 120 rows; the updated styles
assigned none to rows and one fade to each of the two list surfaces. Individual
feature switches and the global switch suppressed both fades. A reduced-motion
run also suppressed them. Finishing the timed shop entrance restored `translate`
and `scale` to `none`, versus upstream's retained `0px` and `1` values. These
checks establish CSS behavior in a fixture, not live Discord rendering speed.
