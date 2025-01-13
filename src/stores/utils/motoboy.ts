import { MotoboyCost } from '../interfaces/motoboy-cost.interface';

export function getMotoboyCost(distance: number): MotoboyCost {
  const timeInHours: number = distance / 40;
  const hours: number = Math.floor(timeInHours);
  const minutes: number = Math.round((timeInHours - hours) * 60);

  return {
    deliveryTime: `${hours} horas e ${minutes} minutos`,
    price: 'R$ 15,00',
    description: 'Motoboy'
  }
}