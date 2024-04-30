export function numberToWords(number) {
  const units = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
  const teens = [
    '',
    'eleven',
    'twelve',
    'thirteen',
    'fourteen',
    'fifteen',
    'sixteen',
    'seventeen',
    'eighteen',
    'nineteen',
  ];
  const tens = [
    '',
    'ten',
    'twenty',
    'thirty',
    'forty',
    'fifty',
    'sixty',
    'seventy',
    'eighty',
    'ninety',
  ];

  function convertLessThanOneThousand(n) {
    if (n === 0) {
      return '';
    } else if (n < 10) {
      return units[n];
    } else if (n < 20) {
      return teens[n - 10];
    } else if (n < 100) {
      return tens[Math.floor(n / 10)] + ' ' + units[n % 10];
    } else {
      return units[Math.floor(n / 100)] + ' hundred ' + convertLessThanOneThousand(n % 100);
    }
  }

  if (number === 1) {
    return 'one';
  } else {
    return convertLessThanOneThousand(number);
  }
}
