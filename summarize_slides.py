import pypdf
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

def summarize_slides_with_images(pdf_name, pdf_path):
    print(f"\n=======================================================")
    print(f"SLIDE TEXT SUMMARY: {pdf_name}")
    print(f"=======================================================")
    reader = pypdf.PdfReader(pdf_path)
    
    for idx, page in enumerate(reader.pages, 1):
        txt = (page.extract_text() or '').strip()
        lines = [l.strip() for l in txt.split('\n') if l.strip()]
        
        # We care about slides with substantive content
        if len(lines) >= 2:
            print(f"Slide {idx:02d}: {lines[0]} // {lines[1] if len(lines)>1 else ''}")
            body = " | ".join(lines[2:8])
            if body:
                print(f"   Content: {body[:150]}")

summarize_slides_with_images("Fundamentals_of_RS.pdf", "../resources/Fundamentals_of_RS.pdf")
summarize_slides_with_images("L-3 Shri Vinay Kumar.pdf", "../resources/L-3 Shri Vinay Kumar.pdf")
summarize_slides_with_images("L2 - Dr. Hina Pande.pdf", "../resources/L2 - Dr. Hina Pande.pdf")
