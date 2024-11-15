import esbuild from "esbuild";

esbuild.build({
    entryPoints: ['api/beams.js'],
    bundle: true,
    platform: 'node',
    outfile: 'dist/beams.js',
}).catch(() => process.exit(1));