import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'booltransform'
})
export class BooltransformPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return value ? 'Ativo' : 'Inativo';
  }

}
