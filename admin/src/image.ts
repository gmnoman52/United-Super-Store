export async function compressProductImage(file: File): Promise<Blob> {
  if (!['image/jpeg','image/png','image/webp'].includes(file.type) || file.size > 5242880) throw new Error('Choose a JPG, PNG or WebP image up to 5 MB');
  const image = await createImageBitmap(file);
  try {
    const scale = Math.min(1, 1200 / Math.max(image.width,image.height));
    if (scale === 1 && file.size < 150000) return file;
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(image.width * scale)); canvas.height = Math.max(1, Math.round(image.height * scale));
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Couldn’t prepare the image. Please try another photo');
    context.drawImage(image,0,0,canvas.width,canvas.height);
    const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve,'image/webp',.82));
    return blob && (scale < 1 || blob.size < file.size) ? blob : file;
  } finally { image.close(); }
}
