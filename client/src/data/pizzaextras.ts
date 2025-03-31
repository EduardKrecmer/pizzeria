import { Extra } from '../types';

// Kategorizované prísady
export interface ExtraCategory {
  id: string;
  name: string;
  items: Extra[];
}

// Definícia kategórií
export const extraCategories: ExtraCategory[] = [
  {
    id: 'cheese',
    name: 'Syry',
    items: [
      { id: 1, name: 'Parmezán', price: 1 },
      { id: 2, name: 'Mozzarella', price: 1 },
      { id: 3, name: 'Niva', price: 1.5 },
      { id: 9, name: 'Údený syr', price: 1.5 },
    ]
  },
  {
    id: 'meat',
    name: 'Mäso',
    items: [
      { id: 4, name: 'Šunka', price: 1.5 },
      { id: 5, name: 'Slanina', price: 1.5 },
      { id: 6, name: 'Saláma', price: 1.5 },
      { id: 7, name: 'Kuracie mäso', price: 2 },
    ]
  },
  {
    id: 'vegetables',
    name: 'Zelenina',
    items: [
      { id: 8, name: 'Rukola', price: 1 },
      { id: 10, name: 'Olivy', price: 1 },
      { id: 11, name: 'Kukurica', price: 0.5 },
      { id: 12, name: 'Cibuľa', price: 0.5 },
      { id: 14, name: 'Paprika', price: 0.5 },
      { id: 15, name: 'Paradajka', price: 0.5 },
    ]
  },
  {
    id: 'other',
    name: 'Ostatné',
    items: [
      { id: 13, name: 'Feferóny', price: 0.5 },
      { id: 16, name: 'Cesnak', price: 0.5 },
      { id: 17, name: 'Chilli', price: 0.5 },
      { id: 18, name: 'Ananás', price: 1 },
    ]
  }
];

// Helper funkcia na získanie všetkých extra prísad ako plochého zoznamu
export const getAllExtras = (): Extra[] => {
  return extraCategories.flatMap(category => category.items);
};

// Helper funkcia na získanie extra prísady podľa ID
export const getExtraById = (id: number): Extra | undefined => {
  return getAllExtras().find(extra => extra.id === id);
};

// Helper funkcia na získanie kategórie podľa ID
export const getCategoryById = (id: string): ExtraCategory | undefined => {
  return extraCategories.find(category => category.id === id);
};