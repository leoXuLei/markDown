export const renderFieldFormat = (item, unit = "%", defaultDisplay = "-") => {
  return `${item || item === 0 ? `${item}${unit}` : defaultDisplay}`;
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
