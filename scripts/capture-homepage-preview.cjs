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
    reducedMotion: "no-preference",
    recordVideo: { dir: TMP, size: { width: 1600, height: 900 } }
  });

  const page = await context.newPage();
  const pageStartedAt = Date.now();
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));

  const response = await page.goto("https://tech-radar-daily.vercel.app/?preview=" + Date.now(), {
    waitUntil: "domcontentloaded",
    timeout: 90000
  });

  if (!response || response.status() >= 400) {
    throw new Error("Production homepage did not return HTTP 200.");
  }


  const expected = fs.readFileSync(path.join(ROOT, "site", "index.html"), "utf8").match(/<title>(.*?)<\/title>/)?.[1];
  if (expected && (await page.title()) !== expected) {
    throw new Error("Production issue and main branch snapshot do not match; do not replace README GIF.");
  }
  if (errors.length) throw new Error("Production page script errors: " + errors.join("; "));
  // Real Chromium viewport checks use the public domain, never local-only files.
  for (const width of [320, 375, 390, 430, 768]) {
    const mobile = await browser.newContext({ viewport: {width,height:844}, isMobile:true, hasTouch:true, deviceScaleFactor:2 });
    try {
      const p = await mobile.newPage();
      const response = await p.goto("https://tech-radar-daily.vercel.app/",{waitUntil:"domcontentloaded",timeout:60000});
      if (!response || response.status()!==200) throw new Error("mobile HTTP "+width);
      await p.waitForSelector("#products .product");
      const result=await p.evaluate(()=>({width:document.documentElement.clientWidth,scrollWidth:document.documentElement.scrollWidth,nav:[...document.querySelectorAll("header .links a")].map(e=>{const r=e.getBoundingClientRect();return [r.left,r.right]}),theme:!!document.querySelector("#theme"),video:document.querySelector("#radar-background-video")?.getAttribute("src")}));
      const overflow=result.scrollWidth-result.width;
      if(overflow>2&&overflow<=8)console.warn("MOBILE_QA_MINOR_OVERFLOW",width,overflow,"px; preview remains valid, layout follow-up recommended");
      if(overflow>8||result.nav.some(([l,r])=>l<0||r>result.width+2)||!result.theme||(width<=760&&result.video))throw new Error("mobile layout "+width+" "+JSON.stringify(result));
      const theme=p.locator("#theme");await theme.click();
      if(!(await p.locator("body").evaluate(e=>e.classList.contains("light"))))throw new Error("theme toggle "+width);
      console.log("MOBILE_QA_OK",width,JSON.stringify(result));
    } finally {await mobile.close();}
  }

  await page.waitForFunction(() => {
    const video = document.querySelector("#radar-background-video");
    const scene = video?.parentElement;
    const fallback = scene?.querySelector(".radar-bg-fallback");
    return !!((video && video.readyState >= 2 && !video.paused && scene?.classList.contains("radar-video-playing")) || (fallback && getComputedStyle(fallback).animationName !== "none" && getComputedStyle(fallback).animationPlayState === "running" && Number(getComputedStyle(fallback).opacity) > 0.1));
  }, null, { timeout: 90000 });

  await page.waitForFunction(() => {
    return document.querySelector("#radar-nav-editorial-v1")
      && document.querySelector("#home .radar-cinematic-title")
      && document.querySelectorAll("#home .hero-copy .metrics .metric strong").length === 3
      && document.querySelectorAll("#home .lf-ecosystem .radar-tag-window").length >= 2;
  }, null, { timeout: 30000 });

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

  // Try high-resolution GIF first, then reduce palette/bitrate before reducing dimensions.
  const budget = 25 * 1024 * 1024;
  const variants = [
    { width: 1440, fps: 12, colors: 128, lossy: 65 },
    { width: 1440, fps: 10, colors: 96, lossy: 85 },
    { width: 1280, fps: 10, colors: 96, lossy: 85 },
    { width: 1280, fps: 8, colors: 80, lossy: 100 },
    { width: 1120, fps: 8, colors: 64, lossy: 120 }
  ];
  const paletteGif = path.join(TMP, "homepage-palette.gif");
  const optimizedGif = path.join(TMP, "homepage-optimized.gif");
  let chosen = null;
  for (const v of variants) {
    execFileSync("ffmpeg", [
      "-hide_banner", "-loglevel", "error", "-y",
      "-ss", trimStart.toFixed(2), "-t", "7", "-i", rawVideo,
      "-filter_complex",
      `[0:v]fps=${v.fps},scale=${v.width}:-1:flags=lanczos,split[s0][s1];[s0]palettegen=max_colors=${v.colors}:stats_mode=diff[p];[s1][p]paletteuse=dither=bayer:bayer_scale=4:diff_mode=rectangle`,
      "-loop", "0", paletteGif
    ], { stdio: "inherit" });
    execFileSync("gifsicle", ["-O3", `--lossy=${v.lossy}`, paletteGif, "-o", optimizedGif], { stdio: "inherit" });
    const size = fs.statSync(optimizedGif).size;
    console.log(JSON.stringify({ ...v, sizeBytes: size }));
    if (size <= budget) { chosen = { ...v, sizeBytes: size }; break; }
  }
  if (!chosen) throw new Error("All animated preview encoding profiles exceeded the repository budget.");
  fs.copyFileSync(optimizedGif, FINAL_GIF);
  console.log(JSON.stringify({
    status: response.status(),
    durationSeconds: 7,
    resolution: chosen.width + "x" + Math.round(chosen.width * 9 / 16),
    fps: chosen.fps,
    colors: chosen.colors,
    sizeBytes: chosen.sizeBytes,
    pageErrors: errors
  }, null, 2));

  fs.rmSync(TMP, { recursive: true, force: true });
})().catch(error => {
  console.error(error);
  process.exit(1);
});
