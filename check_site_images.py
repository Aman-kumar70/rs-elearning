import glob
import re

for f in sorted(glob.glob('rs-*.html')):
    with open(f, 'r', encoding='utf-8') as fp:
        html = fp.read()
    imgs = re.findall(r'<img[^>]+src=["\'](.*?)["\']', html)
    print(f"=== {f} ({len(imgs)} images) ===")
    for img in imgs:
        print("  " + img)
    print()
