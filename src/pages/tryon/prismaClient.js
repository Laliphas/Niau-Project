// prismaClient.js

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const saveCapturedImage = async (imageSrc) => {
  try {
      // Save the imageSrc to the database using Prisma
      const savedImage = await prisma.capturedImages.create({
          data: {
              imageUrl: imageSrc
          }
      });
      console.log('Image saved to database:', savedImage);
  } catch (error) {
      console.error('Error saving image to database:', error);
      throw error; // Rethrow the error to handle it in the calling function
  }
};
