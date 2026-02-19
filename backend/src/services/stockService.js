const prisma = require('../config/db');

async function createStock(data) {
	const {
		name,
		quantity,
		color,
		size,
		thickness,
		laminated = false,
		origin,
		typeNote = null,
	} = data;

	const stock = await prisma.stockMaterial.create({
		data: {
			name,
			quantity,
			color,
			size,
			thickness,
			laminated,
			origin,
			typeNote,
		},
	});

	return stock;
}

async function updateStock(id, updateData) {
	const existing = await prisma.stockMaterial.findUnique({ where: { id } });
	if (!existing) {
		const err = new Error('Stock item not found');
		err.statusCode = 404;
		throw err;
	}

	const updated = await prisma.stockMaterial.update({ where: { id }, data: updateData });
	return updated;
}

async function deleteStock(id) {
	const existing = await prisma.stockMaterial.findUnique({ where: { id } });
	if (!existing) {
		const err = new Error('Stock item not found');
		err.statusCode = 404;
		throw err;
	}

	await prisma.stockMaterial.delete({ where: { id } });
	return { message: 'Deleted' };
}

async function getAllStock(filter = {}) {
	const items = await prisma.stockMaterial.findMany({ where: filter, orderBy: { id: 'asc' } });
	return items;
}

async function getStockById(id) {
	const stock = await prisma.stockMaterial.findUnique({ where: { id } });
	if (!stock) {
		const err = new Error('Stock item not found');
		err.statusCode = 404;
		throw err;
	}
	return stock;
}

module.exports = {
	createStock,
	updateStock,
	deleteStock,
	getAllStock,
	getStockById,
};
