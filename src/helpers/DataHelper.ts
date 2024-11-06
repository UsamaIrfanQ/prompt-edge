class DataHelper {
  stringWithFallback(str: string | undefined, fallback?: string): string {
    return !str || str.trim() === '' ? fallback ?? 'N/A' : str;
  }
}

const dataHelper = new DataHelper();

export default dataHelper;
