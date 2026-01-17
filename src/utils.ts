export const prettifySize = (sizeInKB: number) => {
  if (sizeInKB < 1) {
    return "<1 KB";
  }

  if (sizeInKB < 1024) {
    return `${sizeInKB} KB`;
  }

  return `${(sizeInKB / 1024).toFixed(2)} MB`;
};
