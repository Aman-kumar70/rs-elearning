import os
import pypdf
import sys

sys.stdout.reconfigure(encoding='utf-8')

def print_slide_details(pdf_name, pdf_path, extracted_dir):
    print(f"\n=======================================================")
    print(f"SLIDE DETAILS: {pdf_name}")
    print(f"=======================================================")
    reader = pypdf.PdfReader(pdf_path)
    
    extracted_files = os.listdir(extracted_dir) if os.path.exists(extracted_dir) else []
    
    for page_num, page in enumerate(reader.pages, 1):
        txt = (page.extract_text() or '').strip()
        lines = [l.strip() for l in txt.split('\n') if l.strip()]
        
        prefix = f"p{page_num:02d}_"
        imgs_for_page = [f for f in extracted_files if f.startswith(prefix)]
        
        if imgs_for_page or any(k in txt.lower() for k in ['sensor', 'orbit', 'resolution', 'band', 'reflectance', 'spectral', 'image', 'spatial']):
            print(f"\n--- Slide {page_num} ---")
            print(f"Header: {lines[0] if lines else 'None'}")
            if len(lines) > 1:
                print(f"Sub: {lines[1]}")
            if len(lines) > 2:
                print(f"Body: {' '.join(lines[2:6])[:140]}...")
            if imgs_for_page:
                print(f"Saved Images ({len(imgs_for_page)}): {imgs_for_page}")

print_slide_details("L-3 Shri Vinay Kumar.pdf", "../resources/L-3 Shri Vinay Kumar.pdf", "extracted/l3_platforms")
print_slide_details("Fundamentals_of_RS.pdf", "../resources/Fundamentals_of_RS.pdf", "extracted/fundamentals")
print_slide_details("L2 - Dr. Hina Pande.pdf", "../resources/L2 - Dr. Hina Pande.pdf", "extracted/l2_signatures")
