import { Config } from "@remotion/cli/config";

// H.264 MP4, high quality, broad-compatibility yuv420p.
Config.setVideoImageFormat("jpeg");
Config.setCodec("h264");
Config.setCrf(17);
Config.setPixelFormat("yuv420p");
Config.setChromiumOpenGlRenderer("angle");
