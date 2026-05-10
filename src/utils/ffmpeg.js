import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

let ffmpegInstance = null;

export const loadFFmpeg = async () => {
  if (ffmpegInstance) return ffmpegInstance;
  
  const ffmpeg = new FFmpeg();
  
  const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm';
  await ffmpeg.load({
    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
  });
  
  ffmpegInstance = ffmpeg;
  return ffmpeg;
};

export const trimVideo = async (ffmpeg, file, startTime, endTime, onProgress) => {
  try {
    const inputName = 'input.mp4';
    const outputName = 'output.mp4';

    ffmpeg.on('progress', ({ progress }) => {
      onProgress(progress);
    });

    await ffmpeg.writeFile(inputName, await fetchFile(file));

    // Command to trim using -c copy for original quality
    await ffmpeg.exec([
      '-i', inputName,
      '-ss', startTime.toString(),
      '-to', endTime.toString(),
      '-c', 'copy',
      outputName
    ]);

    const data = await ffmpeg.readFile(outputName);
    const blob = new Blob([data.buffer], { type: 'video/mp4' });
    const url = URL.createObjectURL(blob);
    
    // Clean up
    await ffmpeg.deleteFile(inputName);
    await ffmpeg.deleteFile(outputName);
    
    return url;
  } catch (error) {
    console.error('Error trimming video:', error);
    throw error;
  }
};
