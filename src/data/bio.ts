export async function getBio(): Promise<string> {
  try {
    const response = await fetch('/bio.txt');
    const text = await response.text();
    return text;
  } catch (error) {
    console.error('Failed to load bio:', error);
    return '';
  }
} 