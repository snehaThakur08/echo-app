import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate'
})
export class TruncatePipe implements PipeTransform {

  transform(value: string, ...args: number[]): unknown {

    return value.length < args[0]
      ? value
      : value.slice(0, args[0]) + '...';
  }
}
