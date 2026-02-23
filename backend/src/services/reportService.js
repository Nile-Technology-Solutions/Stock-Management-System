const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Generates a Stock Report containing total materials, low stock count, and list of materials
 */
exports.generateStockReport = async () => {
    // We consider quantity < 10 as low stock for the metric
    const LOW_STOCK_THRESHOLD = 10;

    // Combining reads into a single logical transaction block
    return prisma.$transaction(async (tx) => {
        const totalMaterials = await tx.stockMaterial.count();
        const lowStockItems = await tx.stockMaterial.count({
            where: {
                quantity: {
                    lt: LOW_STOCK_THRESHOLD
                }
            }
        });

        const materials = await tx.stockMaterial.findMany({
            include: {
                category: {
                    select: { name: true }
                }
            },
            orderBy: { name: 'asc' }
        });

        return {
            totalMaterials,
            lowStockItems,
            materials
        };
    });
};

/**
 * Helper to build the prisma date filter
 */
const buildDateFilter = (filters, dateField = 'createdAt') => {
    const dateQuery = {};
    if (filters?.fromDate) {
        dateQuery.gte = filters.fromDate;
    }
    if (filters?.toDate) {
        dateQuery.lte = filters.toDate;
    }
    return Object.keys(dateQuery).length > 0 ? { [dateField]: dateQuery } : {};
};

/**
 * Generates a Production Report based on date filters
 */
exports.generateProductionReport = async (filters) => {
    const dateFilter = buildDateFilter(filters, 'createdAt');

    return prisma.$transaction(async (tx) => {
        // Find counts for each status
        const statusGroups = await tx.productionRecord.groupBy({
            by: ['status'],
            where: dateFilter,
            _count: {
                status: true
            }
        });

        const totalUnderProcess = statusGroups.find(g => g.status === 'UnderProcess')?._count.status || 0;
        const totalCompleted = statusGroups.find(g => g.status === 'Completed')?._count.status || 0;
        const totalRejected = statusGroups.find(g => g.status === 'Rejected')?._count.status || 0;

        const records = await tx.productionRecord.findMany({
            where: dateFilter,
            orderBy: { createdAt: 'desc' },
            include: {
                category: { select: { name: true } }
            }
        });

        return {
            totalUnderProcess,
            totalCompleted,
            totalRejected,
            records
        };
    });
};

/**
 * Generates an Orders Report based on date filters
 */
exports.generateOrdersReport = async (filters) => {
    const dateFilter = buildDateFilter(filters, 'createdAt');

    return prisma.$transaction(async (tx) => {
        const totalOrders = await tx.order.count({ where: dateFilter });
        const revenueAgg = await tx.order.aggregate({
            _sum: {
                totalPrice: true
            },
            where: dateFilter
        });

        const totalRevenue = revenueAgg._sum.totalPrice ? Number(revenueAgg._sum.totalPrice) : 0;

        const orders = await tx.order.findMany({
            where: dateFilter,
            orderBy: { createdAt: 'desc' },
            include: {
                user: { select: { fullName: true, username: true } },
                product: { select: { name: true } }
            }
        });

        return {
            totalOrders,
            totalRevenue,
            orders
        };
    });
};

/**
 * Generates a Payments Report based on date filters
 */
exports.generatePaymentsReport = async (filters) => {
    const dateFilter = buildDateFilter(filters, 'createdAt');

    return prisma.$transaction(async (tx) => {
        const totalPayments = await tx.payment.count({
            where: {
                ...dateFilter,
                status: 'Completed'
            }
        });

        const amountAgg = await tx.payment.aggregate({
            _sum: {
                amount: true
            },
            where: {
                ...dateFilter,
                status: 'Completed'
            }
        });

        const totalAmount = amountAgg._sum.amount ? Number(amountAgg._sum.amount) : 0;

        const payments = await tx.payment.findMany({
            where: dateFilter,
            orderBy: { createdAt: 'desc' }
        });

        return {
            totalPayments,
            totalAmount,
            payments
        };
    });
};

/**
 * Generates a Sales Report based on date filters. Focuses on Product Sales.
 */
exports.generateSalesReport = async (filters) => {
    const dateFilter = buildDateFilter(filters, 'createdAt');

    return prisma.$transaction(async (tx) => {
        // Calculate total sales amount for 'Completed' orders within the period
        const revenueAgg = await tx.order.aggregate({
            _sum: {
                totalPrice: true
            },
            where: {
                ...dateFilter,
                status: 'Completed' // Assumes sales revenue only counts completed orders
            }
        });

        const totalSales = revenueAgg._sum.totalPrice ? Number(revenueAgg._sum.totalPrice) : 0;

        // Group by product name to find top products
        const topProductsGroups = await tx.order.groupBy({
            by: ['productName'],
            _count: {
                productName: true
            },
            _sum: {
                totalPrice: true
            },
            where: {
                ...dateFilter,
                status: 'Completed'
            },
            orderBy: {
                _count: {
                    productName: 'desc'
                }
            },
            take: 10 // Top 10 products
        });

        const topProducts = topProductsGroups.map(group => ({
            productName: group.productName,
            salesCount: group._count.productName,
            revenue: group._sum.totalPrice ? Number(group._sum.totalPrice) : 0
        }));

        let periodLabel = 'All Time';
        if (filters?.fromDate && filters?.toDate) {
            periodLabel = `${filters.fromDate.toISOString().split('T')[0]} to ${filters.toDate.toISOString().split('T')[0]}`;
        } else if (filters?.fromDate) {
            periodLabel = `Since ${filters.fromDate.toISOString().split('T')[0]}`;
        }

        return {
            period: periodLabel,
            totalSales,
            topProducts
        };
    });
};
