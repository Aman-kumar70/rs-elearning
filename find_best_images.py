import os
from PIL import Image

def find_best_images():
    print("=== HIGH VALUE REAL SATELLITE IMAGES IN EXTRACTED DIRS ===")
    
    # 1. L3 Platforms & Sensors
    l3_dir = 'extracted/l3_platforms'
    l3_files = sorted(os.listdir(l3_dir))
    print(f"\n--- {l3_dir} ---")
    for f in l3_files:
        p = os.path.join(l3_dir, f)
        im = Image.open(p)
        kb = os.path.getsize(p) / 1024
        # check specific pages
        page = int(f.split('_')[0][1:])
        if page in [3, 6, 7, 8, 9, 10, 11, 12, 13, 14, 18, 19, 20, 21, 24]:
            print(f"  P.{page:02d} | {f} | {im.size[0]}x{im.size[1]} | {kb:.1f} KB")

    # 2. Fundamentals NASA ARSET
    f_dir = 'extracted/fundamentals'
    f_files = sorted(os.listdir(f_dir))
    print(f"\n--- {f_dir} ---")
    for f in f_files:
        p = os.path.join(f_dir, f)
        im = Image.open(p)
        kb = os.path.getsize(p) / 1024
        page = int(f.split('_')[0][1:])
        if page in [4, 5, 8, 9, 10, 15, 18, 19, 21, 22, 24, 26, 28, 31, 37, 38]:
            print(f"  P.{page:02d} | {f} | {im.size[0]}x{im.size[1]} | {kb:.1f} KB")

    # 3. L2 Signatures ISRO IIRS
    l2_dir = 'extracted/l2_signatures'
    l2_files = sorted(os.listdir(l2_dir))
    print(f"\n--- {l2_dir} ---")
    for f in l2_files:
        p = os.path.join(l2_dir, f)
        im = Image.open(p)
        kb = os.path.getsize(p) / 1024
        page = int(f.split('_')[0][1:])
        if page in [13, 21, 22, 23, 24, 26, 27, 28, 29, 30, 31, 32, 34, 35, 36, 37, 57, 58, 59, 60, 61, 64, 65, 70, 71, 72]:
            print(f"  P.{page:02d} | {f} | {im.size[0]}x{im.size[1]} | {kb:.1f} KB")

find_best_images()
