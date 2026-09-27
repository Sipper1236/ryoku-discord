# ryoku-discord
Ryoku Discord theme for Vesktop/Vencord with optional live Ryoku Palette Bridge colors and rendering improvements.

Based on [niqqudim/ryoku-discord](https://github.com/niqqudim/ryoku-discord), the original Ryoku theme by Ron. Original theme design and artwork credit belongs to the upstream project. This fork adds palette integration, animation changes, and compatibility documentation.

## Palette modes

Install `Ryoku.theme.css` in Vencord’s Themes folder and enable it in Settings → Vencord → Themes. Disable other full themes, including `midnight-ryoku.theme.css`, to avoid competing layout rules.

The user options at the top of the theme include:

```css
:root {
    --ryo-palette-mode: 0; /* 0: original red/gold, 1: live bridge palette */
}
```

To follow [Ryoku Palette Bridge](https://github.com/Sipper1236/ryoku-palette-bridge), set the option to `1` and keep Vencord QuickCSS enabled. The bridge’s generated `:root` colors in `settings/quickCss.css` update the theme while Discord remains open. Keep your mode choice in the theme file: the bridge regenerates QuickCSS on palette changes.

Live mode renders each decorative illustration in one palette tone (multicolor plates become monochrome) and colors the UI. Presence indicators use the bridge’s dedicated online, do-not-disturb, idle, and streaming colors. Missing bridge colors fall back to the original palette. Mode `0` keeps the original palette even when bridge QuickCSS is present. The installed theme remains a single CSS file.

The bridge installer currently enables Midnight automatically. If you run that installer again, disable Midnight in Vencord’s Themes page so Ryoku remains the active layout.

## Rendering

Unread indicators animate with a translation; completed message animations release their transform/filter effects. Reduced-motion settings suppress the supported theme animations. Permanent row `will-change` hints are removed. These changes remove unnecessary rendering work. A [live Vesktop check](PERFORMANCE.md) found stutters with and without the theme; it did not establish a measurable speedup.

## Original theme screenshots

These screenshots come from the upstream project and show its original appearance.

![Chatl](https://i.postimg.cc/4y8wMMHN/image.png)

![Settings](https://i.postimg.cc/C1T2HWkW/image.png)

![Friends](https://i.postimg.cc/VzFN5zmt/image.png)
