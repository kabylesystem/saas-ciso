// BLACKBOX style typography - clean, elegant, minimal
export const typography = {
  h1: {
    fontSize: 28,
    fontWeight: '300' as const,
    letterSpacing: 2,
    textTransform: 'uppercase' as const,
  },
  h2: {
    fontSize: 18,
    fontWeight: '400' as const,
    letterSpacing: 1,
  },
  h3: {
    fontSize: 15,
    fontWeight: '500' as const,
    letterSpacing: 0.5,
  },
  body: {
    fontSize: 14,
    fontWeight: '400' as const,
    letterSpacing: 0.3,
  },
  bodyBold: {
    fontSize: 14,
    fontWeight: '500' as const,
    letterSpacing: 0.3,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
    letterSpacing: 0.2,
  },
  label: {
    fontSize: 10,
    fontWeight: '400' as const,
    letterSpacing: 1.5,
    textTransform: 'uppercase' as const,
  },
  price: {
    fontSize: 16,
    fontWeight: '300' as const,
    letterSpacing: 0.5,
  },
  largeNumber: {
    fontSize: 48,
    fontWeight: '200' as const,
    letterSpacing: -1,
  },
};
