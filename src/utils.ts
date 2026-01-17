export const prettifySize = (sizeInKB: number) => {
  if (sizeInKB > 1024) {
    return `${(sizeInKB / 1024).toFixed(2)} MB`;
  }
  return `${sizeInKB} KB`;
};
