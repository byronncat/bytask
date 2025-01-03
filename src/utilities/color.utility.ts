import Color from 'color';

export function getContrastColor(color: HexColor): string {
  try {
    const luminosity = Color(color).luminosity();
    return luminosity > 0.5 ? '#172B4D' : 'white';
  } catch (error) {
    console.error(error);
    return '#172B4D';
  }
}

export function parseToHexColor(colorInput: string): string | null {
  try {
    const color = Color(colorInput);
    return color.hex().toLowerCase();
  } catch (error) {
    console.error(error);
    return null;
  }
}
