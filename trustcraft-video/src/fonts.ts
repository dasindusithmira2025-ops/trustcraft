import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

/**
 * Inter, loaded from the local static faces bundled under public/fonts
 * (SIL Open Font Licence 1.1 — see public/fonts/OFL.txt). No network
 * dependency during render, so type rendering is deterministic.
 */
export const FONT_FAMILY = "Inter";

let started = false;

export const ensureFonts = (): Promise<void> => {
  if (started) return Promise.resolve();
  started = true;
  const faces: { file: string; weight: string }[] = [
    { file: "Inter-Regular.ttf", weight: "400" },
    { file: "Inter-Medium.ttf", weight: "500" },
    { file: "Inter-SemiBold.ttf", weight: "600" },
    { file: "Inter-Bold.ttf", weight: "700" },
    { file: "Inter-ExtraBold.ttf", weight: "800" },
  ];
  return Promise.all(
    faces.map((f) =>
      loadFont({
        family: FONT_FAMILY,
        url: staticFile(`fonts/${f.file}`),
        weight: f.weight,
        style: "normal",
      }),
    ),
  ).then(() => undefined);
};

// Kick off immediately on import so studio previews have type as early as possible.
void ensureFonts();
