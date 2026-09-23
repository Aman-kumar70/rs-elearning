import shutil
import os
from PIL import Image

def process_and_copy_assets():
    target_dir = 'img'
    os.makedirs(target_dir, exist_ok=True)
    
    asset_map = [
        # (source, destination, description)
        ('extracted/fundamentals/p09_img4_720x480.jpeg', 'fund-water-penetration.jpg', 'NASA ARSET Water penetration'),
        ('extracted/l3_platforms/p07_img7_400x400.jpeg', 'fund-optical-thermal-sar.jpg', 'ISRO Optical vs Thermal vs SAR'),
        ('extracted/l3_platforms/p03_img2_349x450.jpeg', 'plat-ground-truck.jpg', 'Ground-based truck spectrometer'),
        ('extracted/l3_platforms/p03_img7_423x212.jpeg', 'plat-airborne-aircraft.jpg', 'Airborne survey aircraft'),
        ('extracted/l3_platforms/p03_img12_320x240.jpeg', 'plat-spaceborne-satellite.jpg', 'Spaceborne satellite payload'),
        ('extracted/l3_platforms/p06_img4_714x254.jpeg', 'plat-whisk-push-hardware.jpg', 'Whisk-broom mirror vs Push-broom CCD'),
        ('extracted/fundamentals/p15_img4_1920x1080.jpeg', 'plat-goes-earth-disk.jpg', 'Geostationary full Earth disk'),
        ('extracted/l3_platforms/p10_img2_784x584.jpeg', 'res-isro-ladder-awifs-56m.jpg', 'AWiFS 56m'),
        ('extracted/l3_platforms/p10_img3_782x584.jpeg', 'res-isro-ladder-etm-30m.jpg', 'Landsat ETM+ 30m'),
        ('extracted/l3_platforms/p10_img4_774x587.jpeg', 'res-isro-ladder-liss3-23m.jpg', 'IRS LISS-III 23.5m'),
        ('extracted/l3_platforms/p10_img5_765x583.png', 'res-isro-ladder-liss4-5m.jpg', 'IRS LISS-IV 5.8m'),
        ('extracted/l3_platforms/p10_img6_766x584.png', 'res-isro-ladder-carto1-2m.jpg', 'Cartosat-1 2.5m'),
        ('extracted/l3_platforms/p10_img7_642x494.jpeg', 'res-isro-ladder-carto2-submeter.jpg', 'Cartosat-2 0.8m'),
        ('extracted/l3_platforms/p10_img8_616x463.jpeg', 'res-isro-ladder-quickbird.jpg', 'QuickBird 0.6m'),
        ('extracted/l3_platforms/p13_img4_968x385.jpeg', 'res-real-radiometric-runway.jpg', 'Real runway bit depth'),
        ('extracted/l3_platforms/p14_img3_332x224.jpeg', 'res-temporal-preflood.jpg', 'Pre-flood river'),
        ('extracted/l3_platforms/p14_img4_333x221.jpeg', 'res-temporal-postflood.jpg', 'Post-flood inundated'),
        ('extracted/l3_platforms/p21_img2_484x363.jpeg', 'res-cartosat-hyderabad.jpg', 'Cartosat Hyderabad submeter'),
        ('extracted/l3_platforms/p21_img3_482x362.jpeg', 'res-cartosat-bangalore.jpg', 'Cartosat Bangalore airport'),
        ('extracted/l2_signatures/p36_img2_1083x907.jpeg', 'sig-truecolor-natural.jpg', 'Landsat True Color Natural RGB'),
        ('extracted/l2_signatures/p36_img3_1083x907.jpeg', 'sig-falsecolor-fcc.jpg', 'Landsat Standard Infrared FCC')
    ]
    
    print("=== COPYING AND CONVERTING ASSETS TO img/ ===")
    for src, dst_name, desc in asset_map:
        dst = os.path.join(target_dir, dst_name)
        if os.path.exists(src):
            im = Image.open(src)
            # convert RGBA to RGB if saving as JPEG
            if dst.endswith('.jpg') or dst.endswith('.jpeg'):
                im = im.convert('RGB')
            im.save(dst, quality=92)
            print(f"  [COPIED] {dst_name} ({im.size[0]}x{im.size[1]}) - {desc}")
        else:
            print(f"  [ERROR] Source not found: {src}")

process_and_copy_assets()
