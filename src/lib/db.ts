import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface Card {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  rarity: string;
  shop: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function saveCard(card: Omit<Card, 'id' | 'createdAt' | 'updatedAt'>) {
  return prisma.card.create({
    data: {
      name: card.name,
      price: card.price,
      imageUrl: card.imageUrl,
      rarity: card.rarity,
      shop: card.shop
    }
  });
}

export async function searchCards(query: string): Promise<Card[]> {
  return prisma.card.findMany({
    where: {
      name: {
        contains: query
      }
    },
    orderBy: {
      price: 'asc'
    }
  });
}

export async function updateCard(id: string, data: Partial<Card>) {
  return prisma.card.update({
    where: { id },
    data: {
      ...data,
      updatedAt: new Date()
    }
  });
}

export async function deleteCard(id: string) {
  return prisma.card.delete({
    where: { id }
  });
} 