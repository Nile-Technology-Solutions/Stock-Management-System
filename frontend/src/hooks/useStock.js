import { useState, useEffect, useMemo } from 'react';
import { stockApi, stockApiHelpers } from '../services/stockApi';

/**
 * Custom hook for inventory management
 * Handles furniture raw materials inventory
 */
export const useStock = () => {
  const [stockItems, setStockItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastSync, setLastSync] = useState(new Date());

  // Load stock data on mount
  useEffect(() => {
    loadStockData();
  }, []);

  /**
   * Load all stock data from backend
   */
  const loadStockData = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await stockApi.getAllStock();
      
      if (result.success) {
        setStockItems(result.data || []);
        setLastSync(new Date());
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(stockApiHelpers.handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  /**
   * Calculate stock status based on quantity
   * For furniture materials, we consider:
   * - critical: quantity = 0
   * - low: quantity <= 10
   * - normal: quantity > 10
   */
  const getStockStatus = (item) => {
    if (item.quantity === 0) return 'critical';
    if (item.quantity <= 10) return 'low';
    return 'normal';
  };

  /**
   * Enhanced stock items with calculated status
   */
  const enhancedStockItems = useMemo(() => {
    return stockItems.map(item => ({
      ...item,
      status: getStockStatus(item)
    }));
  }, [stockItems]);

  /**
   * Get unique material types for filtering
   */
  const materialTypes = useMemo(() => {
    const types = stockItems
      .map(item => item.name)
      .filter((name, index, self) => self.indexOf(name) === index);
    return types;
  }, [stockItems]);

  /**
   * Get unique origins for filtering
   */
  const origins = useMemo(() => {
    const originList = stockItems
      .map(item => item.origin)
      .filter(origin => origin)
      .filter((origin, index, self) => self.indexOf(origin) === index);
    return originList;
  }, [stockItems]);

  /**
   * Filter stock items
   */
  const filterStock = (searchTerm = '', originFilter = '', statusFilter = '') => {
    return enhancedStockItems.filter(item => {
      const matchesSearch = 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.color && item.color.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.size && item.size.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.thickness && item.thickness.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.typeNote && item.typeNote.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesOrigin = !originFilter || item.origin === originFilter;
      const matchesStatus = !statusFilter || item.status === statusFilter;

      return matchesSearch && matchesOrigin && matchesStatus;
    });
  };

  /**
   * Stock statistics
   */
  const stockStats = useMemo(() => {
    const totalItems = enhancedStockItems.length;
    const lowStockItems = enhancedStockItems.filter(item => item.status === 'low').length;
    const criticalStockItems = enhancedStockItems.filter(item => item.status === 'critical').length;
    const normalStockItems = totalItems - lowStockItems - criticalStockItems;
    const totalQuantity = enhancedStockItems.reduce((sum, item) => sum + (item.quantity || 0), 0);

    // Laminated vs non-laminated
    const laminatedItems = enhancedStockItems.filter(item => item.laminated).length;
    const nonLaminatedItems = totalItems - laminatedItems;

    // Origin breakdown
    const importedItems = enhancedStockItems.filter(item => item.origin === 'Imported').length;
    const localItems = enhancedStockItems.filter(item => item.origin === 'Local').length;

    return {
      totalItems,
      lowStockItems,
      criticalStockItems,
      normalStockItems,
      totalQuantity,
      laminatedItems,
      nonLaminatedItems,
      importedItems,
      localItems
    };
  }, [enhancedStockItems]);

  /**
   * Add new stock item
   */
  const addStockItem = async (newItem) => {
    setLoading(true);
    setError(null);

    try {
      // Validate data
      const validation = stockApiHelpers.validateStockData(newItem);
      if (!validation.valid) {
        setError(validation.errors.join(', '));
        return { success: false, error: validation.errors.join(', ') };
      }

      // Format data for API
      const formattedData = stockApiHelpers.formatStockForApi(newItem);

      // Call API
      const result = await stockApi.createStock(formattedData);

      if (result.success) {
        // Reload data to get updated list
        await loadStockData();
        return { success: true, data: result.data };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMsg = stockApiHelpers.handleApiError(err);
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update stock item
   */
  const updateStockItem = async (id, updates) => {
    setLoading(true);
    setError(null);

    try {
      // Validate data
      const validation = stockApiHelpers.validateStockData(updates);
      if (!validation.valid) {
        setError(validation.errors.join(', '));
        return { success: false, error: validation.errors.join(', ') };
      }

      // Format data for API
      const formattedData = stockApiHelpers.formatStockForApi(updates);

      // Call API
      const result = await stockApi.updateStock(id, formattedData);

      if (result.success) {
        // Reload data to get updated list
        await loadStockData();
        return { success: true, data: result.data };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMsg = stockApiHelpers.handleApiError(err);
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Delete stock item
   */
  const deleteStockItem = async (id) => {
    setLoading(true);
    setError(null);

    try {
      const result = await stockApi.deleteStock(id);

      if (result.success) {
        // Reload data to get updated list
        await loadStockData();
        return { success: true };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMsg = stockApiHelpers.handleApiError(err);
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update quantity only
   */
  const updateQuantity = async (id, newQuantity) => {
    const item = stockItems.find(item => item.id === id);
    if (!item) {
      return { success: false, error: 'Item not found' };
    }

    return updateStockItem(id, { ...item, quantity: newQuantity });
  };

  /**
   * Sync with backend
   */
  const syncWithBackend = async () => {
    return await loadStockData();
  };

  return {
    // Data
    stockItems: enhancedStockItems,
    loading,
    error,
    materialTypes,
    origins,
    stockStats,
    lastSync,

    // Filtering and search
    filterStock,
    getStockStatus,

    // CRUD operations
    addStockItem,
    updateStockItem,
    deleteStockItem,
    updateQuantity,

    // Utility functions
    loadStockData,
    syncWithBackend
  };
};
