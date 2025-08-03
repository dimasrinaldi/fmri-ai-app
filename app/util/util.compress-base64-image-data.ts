import imagemin from "imagemin"
import mozjpeg from "imagemin-mozjpeg"
import pngquant from "imagemin-pngquant"

export async function utilCompressBase64ImageData(base64Str: string, maxSizeKB = 200) {
  // Hilangkan prefix jika ada
  const base64Data = base64Str.replace(/^data:image\/\w+;base64,/, '');
  const inputBuffer = Buffer.from(base64Data, 'base64');
  if (inputBuffer.length <= maxSizeKB * 1024) {
    return base64Data
  }

  let quality = 95;
  let pointBase64Data = base64Data

  while (quality >= 5) {
    //@ts-ignore
    const compressedUint8 = await imagemin.buffer(inputBuffer, {
      plugins: [
        mozjpeg({ quality, revert: true, progressive: false }),
        pngquant({ quality: [quality / 100, (quality / 100) + 0.03] }) // akan di-skip jika bukan PNG
      ]
    });

    const compressedBuffer = Buffer.from(compressedUint8)
    pointBase64Data = compressedBuffer.toString('base64')
    if (compressedBuffer.length / 1024 <= maxSizeKB) {
      break;
    }

    quality -= 5;
  }
  return pointBase64Data
}