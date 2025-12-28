from PIL import Image, ImageSequence

def clean_gif(input_path, output_path):
    try:
        im = Image.open(input_path)
    except IOError:
        print(f"Cannot load image {input_path}")
        return

    frames = []
    for frame in ImageSequence.Iterator(im):
        frame = frame.convert("RGBA")
        datas = frame.getdata()

        new_data = []
        for item in datas:
            # Check for white (255, 255, 255) within a tolerance
            if item[0] > 230 and item[1] > 230 and item[2] > 230:
                new_data.append((255, 255, 255, 0)) # Transparent
            # Check for black (0, 0, 0) within a tolerance
            elif item[0] < 30 and item[1] < 30 and item[2] < 30:
                 new_data.append((0, 0, 0, 0)) # Transparent
            else:
                new_data.append(item)

        frame.putdata(new_data)
        frames.append(frame)

    frames[0].save(output_path, save_all=True, append_images=frames[1:], loop=0, duration=im.info['duration'], disposal=2)
    print(f"Cleaned GIF saved to {output_path}")

if __name__ == "__main__":
    clean_gif(
        r"c:\Users\Rootkit\.gemini\antigravity\scratch\crab-khai\public\mascot\pose-delivery.gif",
        r"c:\Users\Rootkit\.gemini\antigravity\scratch\crab-khai\public\mascot\pose-delivery-cleaned.gif"
    )
