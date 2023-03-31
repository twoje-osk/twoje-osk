export const formatCurrency = (value: number, currency = 'PLN') =>
  new Intl.NumberFormat('pl-PL', { currency, style: 'currency' }).format(value);
