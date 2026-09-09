import { Config } from '@remotion/cli/config'

// PNG intermediates, not JPEG: this film is mostly dark gradients, and JPEG
// chroma subsampling on the intermediate frames introduces visible banding in
// exactly the areas the story lives in. The render is fast enough to afford it.
Config.setVideoImageFormat('png')
// Standard-range 4:2:0 rather than the full-range yuvj420p variant, so black
// levels are correct on projectors and players that respect the range flag.
Config.setPixelFormat('yuv420p')
Config.setOverwriteOutput(true)
// Quality over speed: this is a launch film, not a preview.
Config.setCrf(16)
Config.setChromiumOpenGlRenderer('angle')
