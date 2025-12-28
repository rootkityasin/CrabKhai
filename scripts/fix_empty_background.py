from PIL import Image, ImageSequence

def fix_gif_background(input_path, output_path):
    try:
        im = Image.open(input_path)
    except IOError:
        print(f"Cannot load image {input_path}")
        return

    frames = []
    # Get duration, default to 100ms if not present
    duration = im.info.get('duration', 100)

    for frame in ImageSequence.Iterator(im):
        frame = frame.convert("RGBA")
        
        # Crop the bottom 40 pixels to remove watermark (assuming default size)
        width, height = frame.size
        frame = frame.crop((0, 0, width, height - 40))
        
        datas = frame.getdata()

        new_data = []
        for item in datas:
            # Check for black (0, 0, 0) within a tolerance
            # If it's black (or very dark), change it to White (255, 255, 255, 255)
            # We check if R, G, and B are all less than 50
            if item[0] < 50 and item[1] < 50 and item[2] < 50:
                 new_data.append((255, 255, 255, 255)) 
            else:
                new_data.append(item)

        frame.putdata(new_data)
        frames.append(frame)

    frames[0].save(output_path, save_all=True, append_images=frames[1:], loop=0, duration=duration, disposal=2)
    print(f"Fixed GIF saved to {output_path}")

if __name__ == "__main__":
    fix_gif_background(
        r"c:\Users\Rootkit\.gemini\antigravity\scratch\crab-khai\public\mascot\empty-cart.gif",
        r"c:\Users\Rootkit\.gemini\antigravity\scratch\crab-khai\public\mascot\empty-cart-fixed.gif"
    )
