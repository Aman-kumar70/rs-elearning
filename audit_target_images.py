import os
from PIL import Image

def audit_target_images():
    targets = {
        'L3 - Resolution Ladder (Slide 10)': [
            ('extracted/l3_platforms/p10_img2_784x584.jpeg', 'AWiFS (56m)'),
            ('extracted/l3_platforms/p10_img3_782x584.jpeg', 'Landsat ETM+ (30m)'),
            ('extracted/l3_platforms/p10_img4_774x587.jpeg', 'IRS LISS-III (23.5m)'),
            ('extracted/l3_platforms/p10_img5_765x583.png', 'IRS LISS-IV (5.8m)'),
            ('extracted/l3_platforms/p10_img6_766x584.png', 'Cartosat-1 (2.5m)'),
            ('extracted/l3_platforms/p10_img7_642x494.jpeg', 'Cartosat-2 (0.8m)'),
            ('extracted/l3_platforms/p10_img8_616x463.jpeg', 'QuickBird (0.6m)')
        ],
        'L3 - Platforms in Action (Slide 3)': [
            ('extracted/l3_platforms/p03_img2_349x450.jpeg', 'Ground-based truck spectroradiometer'),
            ('extracted/l3_platforms/p03_img7_423x212.jpeg', 'Airborne survey aircraft'),
            ('extracted/l3_platforms/p03_img12_320x240.jpeg', 'Spaceborne satellite')
        ],
        'L3 - Sensor Types: Optical vs Thermal vs SAR (Slide 7)': [
            ('extracted/l3_platforms/p07_img2_284x400.jpeg', 'Optical visible/IR real data'),
            ('extracted/l3_platforms/p07_img4_331x391.jpeg', 'Thermal infrared day/night heat'),
            ('extracted/l3_platforms/p07_img5_325x387.jpeg', 'Microwave SAR radar cloud-penetrating')
        ],
        'L3 - Whiskbroom vs Pushbroom Hardware (Slide 6)': [
            ('extracted/l3_platforms/p06_img4_714x254.jpeg', 'Whiskbroom mirror vs Pushbroom CCD detector array'),
            ('extracted/l3_platforms/p06_img5_350x253.jpeg', 'Whiskbroom scan mechanism'),
            ('extracted/l3_platforms/p06_img6_372x265.jpeg', 'Pushbroom linear array geometry')
        ],
        'L3 - Real Radiometric Levels (Slide 13)': [
            ('extracted/l3_platforms/p13_img2_666x617.png', '2-level binary runway'),
            ('extracted/l3_platforms/p13_img3_667x617.jpeg', '16-level runway'),
            ('extracted/l3_platforms/p13_img4_968x385.jpeg', '256-level runway comparison')
        ],
        'L3 - Real Temporal Flooding (Slide 14)': [
            ('extracted/l3_platforms/p14_img3_332x224.jpeg', 'Pre-flood normal river'),
            ('extracted/l3_platforms/p14_img4_333x221.jpeg', 'Post-flood inundated floodplains')
        ],
        'L3 - Real High-Res Cartosat Gallery (Slide 21)': [
            ('extracted/l3_platforms/p21_img2_484x363.jpeg', 'Hyderabad urban sub-meter detail'),
            ('extracted/l3_platforms/p21_img3_482x362.jpeg', 'Bangalore airport runways & terminals'),
            ('extracted/l3_platforms/p21_img4_488x366.jpeg', 'Bangalore city core')
        ],
        'L2 - Real Multi-Band Spectral Split (Slide 35)': [
            ('extracted/l2_signatures/p35_img2_545x458.jpeg', 'Landsat Band 1 (Blue)'),
            ('extracted/l2_signatures/p35_img3_545x458.jpeg', 'Landsat Band 2 (Green)'),
            ('extracted/l2_signatures/p35_img4_545x458.jpeg', 'Landsat Band 3 (Red)'),
            ('extracted/l2_signatures/p35_img5_545x458.jpeg', 'Landsat Band 4 (NIR)'),
            ('extracted/l2_signatures/p35_img6_545x458.jpeg', 'Landsat Band 5 (SWIR-1)'),
            ('extracted/l2_signatures/p35_img7_545x458.jpeg', 'Landsat Band 7 (SWIR-2)')
        ],
        'Fundamentals - Water Depth & Scattering (NASA ARSET)': [
            ('extracted/fundamentals/p09_img4_720x480.jpeg', 'Water wavelength penetration & shallow reefs'),
            ('extracted/fundamentals/p15_img4_1920x1080.jpeg', 'GOES Geostationary Full Earth Disk')
        ]
    }

    for cat, img_list in targets.items():
        print(f"\n=== {cat} ===")
        for path, desc in img_list:
            if os.path.exists(path):
                im = Image.open(path)
                print(f"  [EXISTS] {os.path.basename(path)} ({im.size[0]}x{im.size[1]}) - {desc}")
            else:
                print(f"  [MISSING] {path} - {desc}")

audit_target_images()
