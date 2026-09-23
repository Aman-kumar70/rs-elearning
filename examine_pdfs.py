import pypdf
import os
import sys

# Set stdout to UTF-8
sys.stdout.reconfigure(encoding='utf-8')

pdfs = [
    ('Fundamentals_of_RS.pdf', '../resources/Fundamentals_of_RS.pdf', 'RS.1 - Fundamentals'),
    ('L2 - Dr. Hina Pande.pdf', '../resources/L2 - Dr. Hina Pande.pdf', 'RS.2 - Signatures & RS.5 Interpretation'),
    ('L-3 Shri Vinay Kumar.pdf', '../resources/L-3 Shri Vinay Kumar.pdf', 'RS.3 - Platforms & RS.4 Resolution')
]

for filename, path, track_desc in pdfs:
    print(f"\n=======================================================")
    print(f"FILE: {filename} ({track_desc})")
    print(f"=======================================================")
    reader = pypdf.PdfReader(path)
    print(f"Total Pages: {len(reader.pages)}")
    
    for idx, page in enumerate(reader.pages):
        text = page.extract_text() or ''
        lines = [line.strip() for line in text.split('\n') if line.strip()]
        title = lines[0] if lines else 'Empty Page'
        # find second line if first is just page number or date
        if len(lines) > 1 and any(char.isdigit() for char in title) and len(title) < 15:
            title = lines[1]
        
        imgs = page.images
        img_info = []
        for img in imgs:
            try:
                # get dimensions or byte size
                img_info.append(f"{img.name} ({len(img.data)//1024} KB)")
            except:
                img_info.append("img")
        
        # Look for keywords about real images vs diagrams
        content_preview = " | ".join(lines[:4])
        print(f"P.{idx+1:02d}: {len(imgs)} imgs | {content_preview[:100]}")
        if img_info:
            print(f"     Images: {', '.join(img_info[:4])}")
