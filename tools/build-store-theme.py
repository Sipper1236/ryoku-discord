#!/usr/bin/env python3
"""Bundle the optimized v3 base and settings into one installable theme."""
from pathlib import Path
import argparse
import re
import subprocess

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / 'dist' / 'Ryoku Optimized.theme.css'


def bundle(base: str, wrapper: str, name: str = 'Ryoku Optimized') -> str:
    # Strip the settings wrapper's metadata and base import. Keep the base's
    # font/icon imports at the top, where CSS imports are valid.
    wrapper = re.sub(r'^/\*\*.*?\*/\s*', '', wrapper, count=1, flags=re.S)
    wrapper = re.sub(r"@import\s+url\((?:'[^']*'|\"[^\"]*\")\)\s*;", '', wrapper)
    header = f'''/**
 * @name {name}
 * @description Ryoku v3 paper and ink theme with reduced list animation work.
 * @author Ron, refact0r, Sipper1236
 * @version 3.0.1
 * @source https://github.com/Sipper1236/ryoku-discord
 * @website https://github.com/Sipper1236/ryoku-discord
 * @license MIT
 */
'''
    license_notice = '\n/*\n' + (ROOT / 'LICENSE.txt').read_text().strip() + '\n*/\n'
    return header + license_notice + base.rstrip() + '\n\n/* Theme settings and fork overrides. */\n' + wrapper.strip() + '\n'


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--upstream-ref', help='Git revision for an upstream comparison build')
    parser.add_argument('--output', type=Path, default=OUTPUT)
    args = parser.parse_args()
    if args.upstream_ref:
        def read(path: str) -> str:
            return subprocess.check_output(
                ['git', 'show', f'{args.upstream_ref}:{path}'], cwd=ROOT, text=True)
        name = 'Ryoku Upstream Control'
    else:
        def read(path: str) -> str:
            return (ROOT / path).read_text()
        name = 'Ryoku Optimized'
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(bundle(read('build/ryoku.css'), read('theme/ryoku.theme.css'), name))
    print(args.output)
