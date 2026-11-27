const { chromium } = require("playwright");
const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const ROOT = process.cwd();
const TMP = path.join(ROOT, ".homepage-preview-tmp");
const DOCS = path.join(ROOT, "docs");
const FINAL_GIF = path.join(DOCS, "homepage-preview.gif");

(async () => {
  fs.rmSync(TMP, { recursive: true, force: true });
  fs.mkdirSync(TMP, { recursive: true });
  fs.mkdirSync(DOCS, { recursive: true });

  const browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--autoplay-policy=no-user-gesture-required"]
  });

  const context = await browser.newContext({
    viewport: { width: 1600, height: 900 },
    timezoneId: "Asia/Shanghai",
    colorScheme: "dark",
    recordVideo: { dir: TMP, size: { width: 1600, height: 900 } }
  });

  const pageStartedAt = Date.now();
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));

  const response = await page.goto("https://tech-radar-daily.vercel.app/", {
    waitUntil: "domcontentloaded",
    timeout: 90000
  });

  if (!response || response.status() >= 400) {
    throw new Error("Production homepage did not return HTTP 200.");
  }

  await page.waitForFunction(() => {
    const video = document.querySelector("#radar-background-video");
    return video && video.readyState >= 3 && !video.paused;
  }, { timeout: 90000 });

  await page.waitForFunction(() => {
    return document.querySelector("#home .hero-copy .metrics .metrics-heading")
      && document.querySelectorAll("#home .lf-ecosystem .radar-tag-window").length >= 2;
  }, { timeout: 30000 });

  await page.waitForTimeout(1500);
  await page.addStyleTag({
    content: "html,body{scrollbar-width:none!important}::-webkit-scrollbar{display:none!important}"
  });

  const trimStart = Math.max(0, (Date.now() - pageStartedAt) / 1000 - 0.2);
  const video = page.video();

  // Seven seconds captures the moving background and both horizontal tag tracks.
  await page.waitForTimeout(7000);
  await context.close();

  const rawVideo = path.join(TMP, "homepage.webm");
  await video.saveAs(rawVideo);
  await browser.close();

  const paletteGif = path.join(TMP, "homepage-palette.gif");
  const optimizedGif = path.join(TMP, "homepage-optimized.gif");

  execFileSync("ffmpeg", [
    "-hide_banner", "-loglevel", "error", "-y",
    "-ss", trimStart.toFixed(2), "-t", "7", "-i", rawVideo,
    "-filter_complex",
    "[0:v]fps=8,scale=1280:-1:flags=lanczos,split[s0][s1];[s0]palettegen=max_colors=80:stats_mode=diff[p];[s1][p]paletteuse=dither=bayer:bayer_scale=5:diff_mode=rectangle",
    "-loop", "0", paletteGif
  ], { stdio: "inherit" });

  execFileSync("gifsicle", [
    "-O3", "--lossy=80", paletteGif, "-o", optimizedGif
  ], { stdio: "inherit" });

  fs.copyFileSync(optimizedGif, FINAL_GIF);
  const size = fs.statSync(FINAL_GIF).size;

  if (size > 25 * 1024 * 1024) {
    throw new Error("Animated preview exceeded the 25 MB repository budget.");
  }

  console.log(JSON.stringify({
    status: response.status(),
    durationSeconds: 7,
    resolution: "1280x720",
    fps: 8,
    sizeBytes: size,
    pageErrors: errors
  }, null, 2));

  fs.rmSync(TMP, { recursive: true, force: true });
})().catch(error => {
  console.error(error);
  process.exit(1);
});
