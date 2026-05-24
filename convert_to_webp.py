"""
图片批量转 WebP 脚本
使用方法：
  1. pip install Pillow
  2. 把原始图片放到 input_dir 指定的文件夹
  3. python convert_to_webp.py
  4. 转换后的 .webp 文件会输出到 public/images/
"""

from PIL import Image
import os

input_dir = r"C:\Users\15327\Desktop\photos"
output_dir = r"C:\Users\15327\Desktop\VOD\public\images"
quality = 80
max_width = 1600

os.makedirs(output_dir, exist_ok=True)

if not os.path.exists(input_dir):
    os.makedirs(input_dir, exist_ok=True)
    print(f"已创建输入文件夹: {input_dir}")
    print("请将原始图片放入该文件夹后重新运行脚本。")
    exit(0)

converted = 0
skipped = 0

for filename in sorted(os.listdir(input_dir)):
    if not filename.lower().endswith(('.jpg', '.jpeg', '.png', '.bmp', '.tiff', '.tif')):
        skipped += 1
        continue

    filepath = os.path.join(input_dir, filename)
    webp_name = os.path.splitext(filename)[0] + '.webp'
    output_path = os.path.join(output_dir, webp_name)

    try:
        img = Image.open(filepath)

        if img.mode in ('RGBA', 'P'):
            img = img.convert('RGB')

        if img.width > max_width:
            ratio = max_width / img.width
            new_size = (max_width, int(img.height * ratio))
            img = img.resize(new_size, Image.LANCZOS)

        img.save(output_path, 'webp', quality=quality)
        original_size = os.path.getsize(filepath) / 1024
        webp_size = os.path.getsize(output_path) / 1024
        saved = (1 - webp_size / original_size) * 100 if original_size > 0 else 0

        print(f"  {filename} -> {webp_name}  ({original_size:.0f}KB -> {webp_size:.0f}KB, -{saved:.0f}%)")
        converted += 1
    except Exception as e:
        print(f"  [错误] {filename}: {e}")

print(f"\n完成! 转换 {converted} 张, 跳过 {skipped} 个非图片文件")
print(f"输出目录: {output_dir}")
