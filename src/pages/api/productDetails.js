// pages/api/productDetails
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const products = await prisma.productDetail.findMany();
            res.status(200).json(products);
        } catch (error) {
            console.error('Error fetching products:', error);
            res.status(500).json({ error: 'Error fetching products' });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}