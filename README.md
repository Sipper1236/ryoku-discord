# Ryoku discord theme
ink and paper

![Chatl](https://i.postimg.cc/BQGHYJvW/image.png)

![Settings](https://i.postimg.cc/ZnPG8Jf4/image.png)

![Friends](https://i.postimg.cc/nrmKszcN/image.png)

## install

### any client that supports theme files (vencord / vesktop...)

1. download [`dist/Ryoku Optimized.theme.css`](dist/Ryoku%20Optimized.theme.css)
2. put it in the themes folder and enable it
3. if you want you can also easily customize the theme by opening the file and modifying the variables 

The optimized distribution bundles this fork's layout CSS, settings, and most
artwork in one file. Google Fonts, the Context Icons stylesheet, and a few
upstream icon resources are still fetched remotely. The settings wrappers in
`theme/` are also available; they import the upstream hosted base and include
the fork's performance overrides.

## Sipper1236 fork

This fork follows the upstream project and also keeps its earlier palette-bridge
and rendering work. The stylesheet from that earlier fork version is preserved
at [`fork/Ryoku-bridge-performance.theme.css`](fork/Ryoku-bridge-performance.theme.css).
It is a standalone legacy variant; the current upstream theme and assets live in
`theme/`, `build/`, and `assets/`.

The current optimized v3 stylesheet is linked in the install steps above.
The legacy fork stylesheet still follows the Ryoku Palette Bridge setting from
Super+W → Settings → Ryoku Palette Bridge → App integrations → Vesktop.

Build the Store distribution with `python3 tools/build-store-theme.py`.
Live Vesktop comparisons, including channel switching and their limitations,
are documented in [PERFORMANCE.md](PERFORMANCE.md).


## credits

- [system24](https://github.com/refact0r/system24) and [midnight](https://github.com/refact0r/midnight-discord) by refact0r a lot of the code is based on these themes 
- death's-head moth: [Image by pikisuperstar on Magnific](https://www.magnific.com/free-vector/hand-drawn-death-moth-drawing-illustration_49611618.htm#fromView=search&page=1&position=17&uuid=f43cb916-dd55-40b9-b672-1d1ce8c4de50&track=ais_hybrid&query=Free+svg+moth)
