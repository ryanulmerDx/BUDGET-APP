# PWA Icons Setup

Your budget app is now configured as a Progressive Web App (PWA)! To complete the setup, you need to generate app icons.

## Quick Icon Generation

### Option 1: Use an Online Tool (Recommended)
1. Go to https://realfavicongenerator.net/
2. Upload the `public/icon.svg` file
3. Configure your preferences
4. Download the generated icons
5. Place the following files in the `public/` folder:
   - `icon-192x192.png`
   - `icon-512x512.png`
   - `apple-touch-icon.png` (180x180)
   - `favicon.ico`

### Option 2: Use ImageMagick (Command Line)
If you have ImageMagick installed, run these commands:

```bash
# Generate 192x192 icon
convert public/icon.svg -resize 192x192 public/icon-192x192.png

# Generate 512x512 icon
convert public/icon.svg -resize 512x512 public/icon-512x512.png

# Generate Apple touch icon (180x180)
convert public/icon.svg -resize 180x180 public/apple-touch-icon.png
```

### Option 3: Use an Online Converter
1. Go to https://cloudconvert.com/svg-to-png
2. Upload `public/icon.svg`
3. Convert to PNG at these sizes:
   - 192x192 → save as `icon-192x192.png`
   - 512x512 → save as `icon-512x512.png`
   - 180x180 → save as `apple-touch-icon.png`

## What These Icons Are For

- **icon-192x192.png**: Used for Android home screen and app drawer
- **icon-512x512.png**: Used for Android splash screens
- **apple-touch-icon.png**: Used when adding to iOS home screen
- **favicon.ico**: Browser tab icon

Once you add these icons, your PWA will be complete and users can install it on their phones!
