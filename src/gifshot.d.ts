// src/gifshot.d.ts
declare module 'gifshot' {
    interface CreateGIFOptions {
        gifWidth?: number;
        gifHeight?: number;
        images?: string[];
        interval?: number;
        numFrames?: number;
        sampleInterval?: number;
        numWorkers?: number;
    }

    interface CreateGIFResult {
        error: boolean;
        errorCode?: string;
        errorMsg?: string;
        image: string;
        cameraStream?: MediaStream;
    }

    function createGIF(options: CreateGIFOptions, callback: (obj: CreateGIFResult) => void): void;

    export { createGIF, CreateGIFOptions, CreateGIFResult };
}