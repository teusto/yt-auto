export function colorToASS(color, opacity = '1') {
  const opacityHex = Math.round((1 - parseFloat(opacity)) * 255).toString(16).padStart(2, '0').toUpperCase();

  const colors = {
    'white': 'FFFFFF',
    'black': '000000',
    'yellow': '00FFFF',
    'red': '0000FF',
    'green': '00FF00',
    'blue': 'FF0000'
  };

  if (colors[color.toLowerCase()]) {
    return `&H${opacityHex}${colors[color.toLowerCase()]}`;
  }

  // Handle hex codes like #RRGGBB
  if (color.startsWith('#')) {
    const hex = color.substring(1);
    const r = hex.substring(0, 2);
    const g = hex.substring(2, 4);
    const b = hex.substring(4, 6);
    return `&H${opacityHex}${b}${g}${r}`.toUpperCase();
  }

  // Default to white if color is unknown
  return '&H00FFFFFF';
}
