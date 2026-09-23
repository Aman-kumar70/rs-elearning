import pypdf
import os
import sys
from PIL import Image
import io

sys.stdout.reconfigure(encoding='utf-8')

def analyze_pdf_images(pdf_name, pdf_path):
    print(f"\n=======================================================")
    print(f"ANALYZE IMAGES: {pdf_name}")
    print(f"=======================================================")
    reader = pypdf.PdfReader(pdf_path)
    
    for page_num, page in enumerate(reader.pages, 1):
        txt = (page.extract_text() or '').replace('\n', ' ')[:80]
        # find non-trivial images (> 10KB or dimensions > 100x100)
        significant_imgs = []
        for img_idx, img in enumerate(page.images):
            try:
                raw_data = img.data
                size_kb = len(raw_data) / 1024
                # Check dimensions with PIL
                pil_img = Image.open(io.BytesIO(raw_data))
                w, h = pil_img.size
                # Filter out tiny logos, bullets, icons (<150x150 and <20KB)
                if (w > 180 and h > 140) or size_kb > 25:
                    significant_imgs.append((img.name, size_kb, w, h, pil_img.format))
            except Exception as e:
                pass
        
        if significant_imgs:
            print(f"P.{page_num:02d} | {txt}")
            for name, kb, w, h, fmt in significant_imgs:
                print(f"    --> {name}: {w}x{h} px, {kb:.1f} KB, format={fmt}")

analyze_pdf_images("Fundamentals_of_RS.pdf", "../resources/Fundamentals_of_RS.pdf")
analyze_pdf_images("L-3 Shri Vinay Kumar.pdf", "../resources/L-3 Shri Vinay Kumar.pdf")
analyze_pdf_images("L2 - Dr. Hina Pande.pdf", "../resources/L2 - Dr. Hina Pande.pdf")
