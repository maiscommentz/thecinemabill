import * as htmlToImage from "html-to-image";

/**
 * Captures `receiptEl` and composites it onto a 1080×1920 story canvas
 * (Instagram story ratio) with the app's pastel blob background.
 */
async function buildStoryCanvas(receiptEl: HTMLElement): Promise<HTMLCanvasElement> {
    const receiptDataUrl = await htmlToImage.toPng(receiptEl, {
        quality: 1,
        pixelRatio: 3,
        skipFonts: true,
    });

    // Create the canvas (9:16)
    const W = 1080, H = 1920;
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d")!;

    // Background fill
    ctx.fillStyle = "#f5f0f0";
    ctx.fillRect(0, 0, W, H);

    // Radial blobs which mirrors the CSS blobs in the app
    // Each entry: [cx, cy, radius, r, g, b]
    const blobs: [number, number, number, number, number, number][] = [
        [-160, -160, 650, 255, 214, 214], // top-left  pink
        [W + 160, H + 160, 650, 200, 240, 224], // btm-right mint
        [W + 80, H * 0.5, 580, 212, 232, 255], // right blue
        [W * 0.3, H, 540, 232, 212, 255], // btm-left  purple
        [W * 0.65, 0, 520, 255, 236, 210], // top-right peach
    ];
    for (const [x, y, r, cr, cg, cb] of blobs) {
        const g = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, `rgba(${cr},${cg},${cb},0.55)`);
        g.addColorStop(1, `rgba(${cr},${cg},${cb},0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
    }

    // Load receipt image and composite it centred
    const img = new Image();
    img.src = receiptDataUrl;
    await new Promise<void>((resolve) => { img.onload = () => resolve(); });

    const maxW = W - 160; // 80 px padding each side
    const maxH = H * 0.82; // leave breathing room top & bottom
    const scale = Math.min(maxW / img.width, maxH / img.height, 1);
    const dw = img.width * scale;
    const dh = img.height * scale;
    const dx = (W - dw) / 2;
    const dy = (H - dh) / 2;

    ctx.shadowColor = "rgba(0,0,0,0.18)";
    ctx.shadowBlur = 60;
    ctx.shadowOffsetY = 16;
    ctx.drawImage(img, dx, dy, dw, dh);
    ctx.shadowColor = "transparent";

    return canvas;
}

// Public API

/** Renders the canvas and triggers a browser file download. */
export async function downloadStory(receiptEl: HTMLElement, filename: string): Promise<void> {
    const canvas = await buildStoryCanvas(receiptEl);
    const link = document.createElement("a");
    link.download = filename;
    link.href = canvas.toDataURL("image/png");
    link.click();
}

/**
 * Renders the canvas and opens the native OS share sheet (Web Share API).
 * On desktop or unsupported browsers, falls back to copying the page URL.
 *
 * @returns `"shared"` | `"copied"` | `"unsupported"` so the caller can show feedback.
 */
export async function shareStory(
    receiptEl: HTMLElement,
    filename: string,
    shareUrl: string
): Promise<"shared" | "copied" | "unsupported"> {
    const canvas = await buildStoryCanvas(receiptEl);

    // Try Web Share API with file (works on Android / iOS Safari)
    const blob: Blob = await new Promise((res, rej) =>
        canvas.toBlob((b) => (b ? res(b) : rej(new Error("toBlob failed"))), "image/png")
    );
    const file = new File([blob], filename, { type: "image/png" });

    if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({
            files: [file],
            title: "The Cinema Bill",
            text: "Just got my film receipt from The Cinema Bill! 🍿 Check it out here : " + shareUrl,
        });
        return "shared";
    }

    // Fallback for unsupported devices or browsers
    try {
        await navigator.clipboard.writeText(shareUrl);
        return "copied";
    } catch {
        return "unsupported";
    }
}
