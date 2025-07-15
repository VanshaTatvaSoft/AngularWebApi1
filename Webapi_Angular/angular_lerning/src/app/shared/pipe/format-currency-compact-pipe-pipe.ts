import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatCurrencyCompactPipe'
})
export class FormatCurrencyCompactPipePipe implements PipeTransform {

  transform(value: number,currency: string = 'USD',locale: string = 'en-US', rate: number = 83): string {

    if (value === null || value === undefined || isNaN(value)) return '';

    const convertedValue = value / rate;

    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      notation: 'compact',
      compactDisplay: 'short',
      maximumFractionDigits: 1
    }).format(convertedValue);

  }

}
