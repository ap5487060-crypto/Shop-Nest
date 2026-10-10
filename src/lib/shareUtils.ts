import { Product } from '../types';

/**
 * Converts a data URL (base64) to a Blob directly in browser memory without network fetch
 */
function dataURLtoBlob(dataurl: string): Blob | null {
  try {
    const arr = dataurl.split(',');
    if (arr.length < 2) return null;
    const mimeMatch = arr[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  } catch (err) {
    console.warn('Failed to convert base64 data URL to blob:', err);
    return null;
  }
}

/**
 * Downloads or loads an image and produces a File object for Web Share API
 */
export async function getProductImageFile(product: Product): Promise<File | null> {
  const photoUrl = product.thumbnail || (product.images && product.images[0]) || '';
  if (!photoUrl) return null;

  const safeFilename = `${(product.slug || product.name || 'product').replace(/[^a-z0-9]/gi, '-').toLowerCase().slice(0, 40)}.jpg`;

  try {
    // 1. If base64 data URL (uploaded directly from device gallery)
    if (photoUrl.startsWith('data:')) {
      const blob = dataURLtoBlob(photoUrl);
      if (blob) {
        return new File([blob], safeFilename, { type: blob.type || 'image/jpeg' });
      }
    }

    // 2. Try direct fetch for remote URLs
    try {
      const resp = await fetch(photoUrl, { mode: 'cors' });
      if (resp.ok) {
        const blob = await resp.blob();
        return new File([blob], safeFilename, { type: blob.type || 'image/jpeg' });
      }
    } catch {
      // Direct fetch may be blocked by CORS on external hosts
    }

    // 3. Canvas proxy fallback to load image and extract blob
    const canvasFile = await new Promise<File | null>((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth || img.width;
          canvas.height = img.naturalHeight || img.height;
          const ctx = canvas.getContext('2d');
          if (!ctx) return resolve(null);
          ctx.drawImage(img, 0, 0);
          canvas.toBlob(
            (b) => {
              if (b) {
                resolve(new File([b], safeFilename, { type: 'image/jpeg' }));
              } else {
                resolve(null);
              }
            },
            'image/jpeg',
            0.92
          );
        } catch {
          resolve(null);
        }
      };
      img.onerror = () => resolve(null);
      img.src = photoUrl;
    });

    return canvasFile;
  } catch (err) {
    console.warn('Could not generate shareable image file:', err);
    return null;
  }
}

/**
 * Formats WhatsApp text message for the product
 */
export function formatProductWhatsAppText(product: Product): string {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://shop-nest-kappa-eight.vercel.app';
  const productPageUrl = `${origin}/?product=${product.id}`;
  const directBuyUrl = product.affiliate_url && product.affiliate_url !== '#' ? product.affiliate_url : productPageUrl;

  const priceText = product.price
    ? `💰 *Price:* ₹${product.price} ${product.discount_percentage ? `(${product.discount_percentage}% OFF)` : ''}\n`
    : '';

  return (
    `🌸 *${product.name}*\n` +
    `🏷️ *Platform:* ${product.affiliate_platform || 'Meesho'}\n` +
    priceText +
    `\n👉 *Direct Buy Link:*\n${directBuyUrl}\n\n` +
    `🔗 *View Full Photos & Details:*\n${productPageUrl}`
  );
}

/**
 * 1-Click WhatsApp Share:
 * - On Mobile (Android / iOS): Attaches the actual product photo using Web Share API and passes text
 * - Fallback: Opens WhatsApp with rich formatted product message and instant direct link
 */
export async function shareProductToWhatsApp(product: Product): Promise<void> {
  const text = formatProductWhatsAppText(product);
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://shop-nest-kappa-eight.vercel.app';
  const productPageUrl = `${origin}/?product=${product.id}`;

  // Try Native Share with Image Attachment on Mobile devices
  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      const imageFile = await getProductImageFile(product);

      if (imageFile && navigator.canShare && navigator.canShare({ files: [imageFile] })) {
        await navigator.share({
          title: product.name,
          text: text,
          files: [imageFile],
        });
        return;
      }

      // If cannot share files, try sharing with text + URL
      await navigator.share({
        title: product.name,
        text: text,
        url: productPageUrl,
      });
      return;
    } catch (err: any) {
      if (err?.name === 'AbortError') return; // User cancelled the share dialog
    }
  }

  // Desktop or fallback: Open WhatsApp Web / App directly
  const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
  const win = window.open(waUrl, '_blank', 'noopener,noreferrer');
  if (!win) {
    const link = document.createElement('a');
    link.href = waUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
