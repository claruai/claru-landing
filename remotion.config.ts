import { Config } from "@remotion/cli/config";

// Required for Three.js rendering — use ANGLE instead of default OpenGL
Config.setChromiumOpenGlRenderer("angle");
