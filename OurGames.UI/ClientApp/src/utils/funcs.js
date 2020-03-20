export function distinct(arr, compare) {
  var a = arr.concat();
  for (var i = 0; i < a.length; ++i) {
    for (var j = i + 1; j < a.length; ++j) {
      if (compare(a[i]) === compare(a[j])) a.splice(j--, 1);
    }
  }

  return a;
}

export function formatRawValue(rawValue, unit) {
  const minChars = 3;

  let result = `${rawValue}`;

  if (result.length < minChars) {
    const numbers = minChars - result.length;
    const leftZeroPad = '0'.repeat(numbers);
    result = `${leftZeroPad}${result}`;
  }

  let beforeSeparator = result.slice(0, result.length - 2);
  const afterSeparator = result.slice(result.length - 2);

  if (beforeSeparator.length > 3) {
    const chars = beforeSeparator.split('').reverse();

    let withDots = '';

    for (let i = chars.length - 1; i >= 0; i--) {
      const char = chars[i];
      const dot = i % 3 === 0 && i !== 0 ? '.' : '';
      withDots = `${withDots}${char}${dot}`;
    }

    beforeSeparator = withDots;
  }

  while (beforeSeparator.endsWith('.'))
    beforeSeparator = beforeSeparator.substring(0, beforeSeparator.length - 1);

  result = beforeSeparator + ',' + afterSeparator;

  if (unit) {
    result = `${unit} ${result}`;
  }

  return result;
}
