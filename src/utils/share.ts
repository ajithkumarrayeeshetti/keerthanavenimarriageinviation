import { weddingConfig } from "../weddingConfig";

export async function shareInvite() {
  const message = `You're invited! Join the wedding celebration of ${weddingConfig.partner1} & ${weddingConfig.partner2} on ${weddingConfig.weddingDateDisplay.en}. ${weddingConfig.siteUrl}`;

  if (navigator.share) {
    try {
      await navigator.share({
        title: `${weddingConfig.partner1} & ${weddingConfig.partner2}'s Wedding`,
        text: message,
        url: weddingConfig.siteUrl,
      });
      return;
    } catch {
      // user cancelled or share failed — fall through to WhatsApp link
    }
  }

  const waUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
  window.open(waUrl, "_blank", "noopener,noreferrer");
}
