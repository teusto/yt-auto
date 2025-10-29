export function buildForceStyle(style, fontSize, marginV, colorToASS) {
  let forceStyle = `Alignment=${style.alignment},FontSize=${fontSize},MarginV=${marginV}`;
  forceStyle += `,FontName=${style.fontFamily}`;
  forceStyle += `,PrimaryColour=${colorToASS(style.fontColor)}`;
  forceStyle += `,OutlineColour=${colorToASS(style.outlineColor)}`;
  forceStyle += `,Outline=${style.outlineWidth}`;
  if (style.bold) forceStyle += ',Bold=1';
  if (style.italic) forceStyle += ',Italic=1';

  // Handle background color and opacity
  if (style.backgroundColor && style.backgroundColor !== 'transparent') {
    const [color, opacity] = style.backgroundColor.split('@');
    const bgColor = colorToASS(color, opacity || '1');
    forceStyle += `,BackColour=${bgColor}`;
    // BorderStyle=4 is for a background box that adapts to text width
    forceStyle += ',BorderStyle=4';
  }

  // Handle line spacing
  if (style.lineSpacing) {
    forceStyle += `,Spacing=${style.lineSpacing}`;
  }

  return forceStyle;
}
