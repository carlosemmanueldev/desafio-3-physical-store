import { MotoboyCost } from '../interfaces/motoboy-cost.interface';

export function getMotoboyCost(distance: number): MotoboyCost {
  const timeInHours: number = distance / 40;
  let hours: number = Math.floor(timeInHours);
  let minutes: number = Math.round((timeInHours - hours) * 60);

  if (hours === 0 && minutes < 30) {
    minutes = 30;
  }

  if (minutes === 60) {
    hours += 1;
    minutes = 0;
  }

  return {
    deliveryTime: `${hours} horas e ${minutes} minutos`,
    price: 'R$ 15,00',
    description: 'Motoboy',
  };
}
