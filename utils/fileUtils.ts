export interface Base64File {
  dataUrl: string;    // For <img src="..."> e.g., "data:image/png;base64,..."
  base64: string;     // Raw base64 data for API
  mimeType: string;   // e.g., "image/png"
  width: number;
  height: number;
}

export const fileToBase64 = (file: File): Promise<Base64File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const image = new Image();
      image.onload = () => {
        const mimeType = dataUrl.substring(dataUrl.indexOf(':') + 1, dataUrl.indexOf(';'));
        const base64 = dataUrl.substring(dataUrl.indexOf(',') + 1);
        resolve({ dataUrl, base64, mimeType, width: image.width, height: image.height });
      };
      image.onerror = () => reject(new Error('Could not load image to determine dimensions.'));
      image.src = dataUrl;
    };
    reader.onerror = (error) => reject(error);
  });
};
