import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsRutChileno(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isRutChileno',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (!/^\d{7,8}-[0-9Kk]$/.test(value)) {
            return false;
          }
          const [cuerpo, dv] = value.split('-');
          let suma = 0;
          let multiplo = 2;

          for (let i = cuerpo.length - 1; i >= 0; i--) {
            suma += parseInt(cuerpo.charAt(i), 10) * multiplo;
            multiplo = multiplo < 7 ? multiplo + 1 : 2;
          }

          const dvEsperado = 11 - (suma % 11);
          const dvFinal =
            dvEsperado === 11 ? '0' : dvEsperado === 10 ? 'K' : dvEsperado.toString();

          return dvFinal.toUpperCase() === dv.toUpperCase();
        },
      },
    });
  };
}
