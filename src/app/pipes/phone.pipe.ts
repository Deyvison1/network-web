import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phonePipe',
})
export class PhonePipe implements PipeTransform {
  transform(value: string | number) {
    if (typeof value === 'number') {
      value = value.toString();
    }

    switch (value.length) {
      case 10:
        value = value.replace(/(\d{2})?(\d{4})?(\d{4})/, '($1) $2-$3');
        break;
      case 11:
        value = value.replace(
          /(\d{2})?(\d{1})?(\d{4})?(\d{4})/,
          '($1) $2 $3-$4'
        );
        break;
      default:
        break;
    }
    return value;
  }
}
