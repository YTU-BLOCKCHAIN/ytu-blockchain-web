"""
Bir görseli kulübün sosyal medya postlarındaki nokta dokusuna çevirir.

Algoritma Drive'daki post kaynaklarının (`design/sosyal-medya/*/kaynak/*.html`)
canvas `dither()` fonksiyonunun birebir karşılığı: 4x4 Bayer, her hücre bir
kare nokta, noktalar arası `gap` piksel boşluk. Sitede postlarla aynı doku
görünsün diye görseller çalışma anında değil, burada bir kez üretiliyor.

Çıktı beyaz nokta + şeffaf zemin (2 renkli paletli PNG). Aynı dosya hem void
hem signal yüzeyinde çalışır. Kaynak görseller depoda tutulmuyor; Drive'daki
`design/gorseller/` ve post `img/` klasörlerinden okunuyor.

Kullanım:
    python3 scripts/dither.py girdi.png public/images/dither/cikti.png \
        --width 2200 --cell 10 --gap 2 [--fit contain] [--fade b --fw .2]
        [--lo 0 --hi 255 --gamma 1]

`--width` ve `--cell` çıktı pikseli: 2x ekran için ikisi de iki katı verilir
(cell 10 → CSS'te 5px nokta, postlardaki ölçü).
"""

import argparse

from PIL import Image

BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5]

parser = argparse.ArgumentParser()
parser.add_argument("src")
parser.add_argument("dst")
parser.add_argument("--width", type=int, required=True)
parser.add_argument("--height", type=int, help="verilmezse kaynağın oranı")
parser.add_argument("--cell", type=int, default=10)
parser.add_argument("--gap", type=int, default=2)
parser.add_argument("--fit", choices=["contain", "cover"], default="contain")
parser.add_argument("--fx", type=float, default=0.5, help="yatay odak (cover)")
parser.add_argument("--fy", type=float, default=0.5, help="dikey odak (cover)")
parser.add_argument("--lo", type=float, default=0)
parser.add_argument("--hi", type=float, default=255)
parser.add_argument("--gamma", type=float, default=1)
parser.add_argument("--floor", type=float, default=0,
                    help="figür içi en düşük yoğunluk")
parser.add_argument("--fade", default="", help="kenar yumuşatma: l r t b")
parser.add_argument("--fw", type=float, default=0.25, help="yumuşatma oranı")
args = parser.parse_args()

src = Image.open(args.src).convert("RGBA")
W = args.width
H = args.height or round(src.height * W / src.width)
cw, ch = -(-W // args.cell), -(-H // args.cell)

# Kaynak önce hücre ızgarasına küçültülüyor (her hücre tek örnek), dither
# sonra yapılıyor. Tersi noktaları bulanık griye çevirirdi.
pick = min if args.fit == "contain" else max
s = pick(cw / src.width, ch / src.height)
dw, dh = max(1, round(src.width * s)), max(1, round(src.height * s))
grid = Image.new("RGBA", (cw, ch), (0, 0, 0, 0))
grid.paste(src.resize((dw, dh), Image.LANCZOS),
           (round((cw - dw) * args.fx), round((ch - dh) * args.fy)))
px = grid.load()


def ramp(t):
    return min(1.0, t / args.fw)


out = Image.new("P", (W, H), 0)
out.putpalette([0, 0, 0, 255, 255, 255])
dot = args.cell - args.gap
for j in range(ch):
    for i in range(cw):
        r, g, b, a = px[i, j]
        if a < 5:
            continue
        lum = (0.299 * r + 0.587 * g + 0.114 * b - args.lo) / (args.hi - args.lo)
        lum = max(0.0, min(1.0, lum)) ** args.gamma
        lum = (args.floor + (1 - args.floor) * lum) * a / 255
        u, v = i / cw, j / ch
        if "l" in args.fade:
            lum *= ramp(u)
        if "r" in args.fade:
            lum *= ramp(1 - u)
        if "t" in args.fade:
            lum *= ramp(v)
        if "b" in args.fade:
            lum *= ramp(1 - v)
        if lum > (BAYER[(j & 3) * 4 + (i & 3)] + 0.5) / 16:
            x, y = i * args.cell, j * args.cell
            out.paste(1, (x, y, min(x + dot, W), min(y + dot, H)))

out.save(args.dst, optimize=True, transparency=0)
print(f"{args.dst}  {W}x{H}")
