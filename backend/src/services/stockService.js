const prisma = require('../config/db');

async function createStock(data) {
	const {
		name,
		quantity,
		color = null,
		size = null,
		thickness = null,
		laminated = false,
		origin,
		typeNote = null,
		categoryId = null,
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
			categoryId: categoryId ? parseInt(categoryId) : null,
		},
		include: { category: true },
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

	if (updateData.categoryId !== undefined) {
		updateData.categoryId = updateData.categoryId ? parseInt(updateData.categoryId) : null;
	}

	const updated = await prisma.stockMaterial.update({
		where: { id },
		data: updateData,
		include: { category: true },
	});
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
	const items = await prisma.stockMaterial.findMany({
		where: filter,
		include: { category: true },
		orderBy: { id: 'asc' },
	});
	return items;
}

async function getStockById(id) {
	const stock = await prisma.stockMaterial.findUnique({
		where: { id },
		include: { category: true },
	});
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
