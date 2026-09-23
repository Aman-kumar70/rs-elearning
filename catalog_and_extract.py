import pypdf
import os
import sys
from PIL import Image
import io

sys.stdout.reconfigure(encoding='utf-8')

def extract_catalog(pdf_name, pdf_path, out_dir):
    os.makedirs(out_dir, exist_ok=True)
    reader = pypdf.PdfReader(pdf_path)
    print(f"\n=======================================================")
    print(f"CATALOGING: {pdf_name} ({len(reader.pages)} pages)")
    print(f"=======================================================")
    
    catalog = []
    
    for page_num, page in enumerate(reader.pages, 1):
        txt_lines = [l.strip() for l in (page.extract_text() or '').split('\n') if l.strip()]
        header = " | ".join(txt_lines[:3])
        
        page_imgs = []
        for img_idx, img in enumerate(page.images):
            try:
                data = img.data
                kb = len(data) / 1024
                pil_img = Image.open(io.BytesIO(data))
                w, h = pil_img.size
                # Save significant images
                if (w > 200 and h > 150) or kb > 30:
                    filename = f"p{page_num:02d}_img{img_idx+1}_{w}x{h}.{pil_img.format.lower()}"
                    out_path = os.path.join(out_dir, filename)
                    pil_img.save(out_path)
                    page_imgs.append((filename, w, h, kb, pil_img.format))
            except Exception as e:
                pass
        
        if page_imgs or len(txt_lines) > 0:
            print(f"Page {page_num:02d}: {header[:80]}")
            for fname, w, h, kb, fmt in page_imgs:
                print(f"   [SAVED] {fname} ({w}x{h}, {kb:.1f} KB, {fmt})")
            catalog.append({
                'page': page_num,
                'header': header,
                'text': "\n".join(txt_lines),
                'images': page_imgs
            })

extract_catalog("Fundamentals_of_RS.pdf", "../resources/Fundamentals_of_RS.pdf", "extracted/fundamentals")
extract_catalog("L-3 Shri Vinay Kumar.pdf", "../resources/L-3 Shri Vinay Kumar.pdf", "extracted/l3_platforms")
extract_catalog("L2 - Dr. Hina Pande.pdf", "../resources/L2 - Dr. Hina Pande.pdf", "extracted/l2_signatures")
