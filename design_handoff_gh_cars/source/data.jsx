// ── Updated sample data with more vehicles and richer fields ───

const VEHICLES = [
  { id: 1, marca: 'Toyota', modelo: 'Corolla Cross', anio: 2023, version: 'XEi 2.0 CVT', km: 18500, precio: 28500, transmision: 'Automática', combustible: 'Nafta', color: 'Gris plata', tipo: 'SUV',
    img: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=1200&auto=format&fit=crop',
    fotos: [
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=1400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1542362567-b07e54358753?w=1400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1400&auto=format&fit=crop',
    ]
  },
  { id: 2, marca: 'Volkswagen', modelo: 'Amarok', anio: 2022, version: 'V6 Highline 4x4', km: 42000, precio: 42800, transmision: 'Automática', combustible: 'Diésel', color: 'Negro', tipo: 'Pickup',
    img: 'https://images.unsplash.com/photo-1605816988069-b11383b50717?w=1200&auto=format&fit=crop',
    fotos: ['https://images.unsplash.com/photo-1605816988069-b11383b50717?w=1400&auto=format&fit=crop'] },
  { id: 3, marca: 'Ford', modelo: 'Ranger', anio: 2024, version: 'Limited 3.0 V6', km: 6200, precio: 56900, transmision: 'Automática', combustible: 'Diésel', color: 'Azul', tipo: 'Pickup',
    img: 'https://images.unsplash.com/photo-1519440637-e966b59cab28?w=1200&auto=format&fit=crop',
    fotos: ['https://images.unsplash.com/photo-1519440637-e966b59cab28?w=1400&auto=format&fit=crop'] },
  { id: 4, marca: 'Chevrolet', modelo: 'Tracker', anio: 2022, version: 'LTZ 1.2 Turbo', km: 31000, precio: 22500, transmision: 'Automática', combustible: 'Nafta', color: 'Blanco', tipo: 'SUV',
    img: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=1200&auto=format&fit=crop',
    fotos: ['https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=1400&auto=format&fit=crop'] },
  { id: 5, marca: 'Peugeot', modelo: '208', anio: 2021, version: 'Allure 1.6', km: 48000, precio: 14200, transmision: 'Manual', combustible: 'Nafta', color: 'Rojo', tipo: 'Auto',
    img: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200&auto=format&fit=crop',
    fotos: ['https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1400&auto=format&fit=crop'] },
  { id: 6, marca: 'Honda', modelo: 'HR-V', anio: 2023, version: 'EXL CVT', km: 22000, precio: 31900, transmision: 'Automática', combustible: 'Nafta', color: 'Gris', tipo: 'SUV',
    img: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=1200&auto=format&fit=crop',
    fotos: ['https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=1400&auto=format&fit=crop'] },
  { id: 7, marca: 'Renault', modelo: 'Duster', anio: 2022, version: 'Iconic 1.3 Turbo', km: 35000, precio: 21800, transmision: 'Manual', combustible: 'Nafta', color: 'Naranja', tipo: 'SUV',
    img: 'https://images.unsplash.com/photo-1552519507-88aa2dfa9fdb?w=1200&auto=format&fit=crop',
    fotos: ['https://images.unsplash.com/photo-1552519507-88aa2dfa9fdb?w=1400&auto=format&fit=crop'] },
  { id: 8, marca: 'Volkswagen', modelo: 'Taos', anio: 2024, version: 'Highline 250 TSI', km: 9500, precio: 35900, transmision: 'Automática', combustible: 'Nafta', color: 'Blanco perla', tipo: 'SUV',
    img: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1200&auto=format&fit=crop',
    fotos: ['https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1400&auto=format&fit=crop'] },
];

const TC = 1415;
const fmt = (n) => n.toLocaleString('es-AR');
const PHONE = '+54 9 11 6269-2000';
const ADDRESS = 'Ruta 9 km 1750, B1621 Benavidez';

Object.assign(window, { VEHICLES, TC, fmt, PHONE, ADDRESS });
