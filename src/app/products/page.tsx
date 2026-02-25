/* eslint-disable @typescript-eslint/no-explicit-any */
// app/products/page.tsx - UPDATED WITH NEW PRICE FIELDS
"use client";

import { useState } from "react";
import {
  PlusIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  CubeIcon,
  TagIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/outline";
import { ProductForm } from "@/components/productform";
import {
  useProducts,
  useProductStats,
  useDeleteProduct,
  useCreateProduct,
  useUpdateProduct,
} from "@/lib/hooks/use-products";
import { ProductFilters } from "@/lib/services/products";
import toast from "react-hot-toast";

const categories = [
  "Vegetables",
  "Fruits",
  "Leafy Greens",
  "Poultry",
  "Dairy",
  "Grains",
  "Herbs & Spices",
  "Other",
];

const statusFilters = [
  { id: "all", label: "All Products", color: "bg-gray-100" },
  {
    id: "in_stock",
    label: "In Stock",
    color: "bg-green-100",
    textColor: "text-green-800",
  },
  {
    id: "low_stock",
    label: "Low Stock",
    color: "bg-yellow-100",
    textColor: "text-yellow-800",
  },
  {
    id: "out_of_stock",
    label: "Out of Stock",
    color: "bg-red-100",
    textColor: "text-red-800",
  },
];

export default function ProductsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [filters, setFilters] = useState<ProductFilters>({
    page: 1,
    limit: 12,
  });
  const [searchQuery, setSearchQuery] = useState("");

  // React Query hooks
  const {
    data: productsData,
    isLoading,
    isError,
    refetch,
  } = useProducts(filters);

  const { data: statsData } = useProductStats();
  const deleteMutation = useDeleteProduct();
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();

  const handleEdit = (product: any) => {
    setSelectedProduct(product);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteMutation.mutateAsync(id);
        toast.success("Product deleted successfully");
      } catch (error) {
        toast.error("Failed to delete product");
      }
    }
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    // Debounce search
    const timer = setTimeout(() => {
      setFilters((prev) => ({
        ...prev,
        search: value || undefined,
        page: 1, // Reset to first page
      }));
    }, 500);
    return () => clearTimeout(timer);
  };

  const handleStatusFilter = (status: string) => {
    setFilters((prev) => ({
      ...prev,
      status: status === "all" ? undefined : status,
      page: 1,
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      page: 1,
      limit: 12,
    });
    setSearchQuery("");
  };

  const handleFormSubmit = async (data: any) => {
    try {
      // Convert prices and stock to numbers
      const productData = {
        ...data,
        catalogRetailerId: data.catalogRetailerId,
        price: parseInt(data.price),
        stock: parseInt(data.stock),
        images: data.images || [],
        videos: data.videos || [],
        isActive: data.isActive !== false,
        syncToCatalog: data.syncToCatalog !== false,
        // Handle backward compatibility for old products
        category: data.category || "Other",
        unit: data.unit || "kg",
      };

      console.log("Submitting product data:", productData);

      if (selectedProduct) {
        // Update existing product
        await updateMutation.mutateAsync({
          id: selectedProduct._id || selectedProduct.id,
          data: productData,
        });
        toast.success("Product updated successfully");
      } else {
        // Create new product
        await createMutation.mutateAsync(productData);
        toast.success("Product created successfully");
      }

      setIsFormOpen(false);
      setSelectedProduct(null);
      refetch(); // Refresh the products list
    } catch (error: any) {
      console.error("Error submitting product:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to save product"
      );
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "in_stock":
        return {
          text: "In Stock",
          class: "bg-green-100 text-green-800",
          dot: "bg-green-500",
        };
      case "low_stock":
        return {
          text: "Low Stock",
          class: "bg-yellow-100 text-yellow-800",
          dot: "bg-yellow-500",
        };
      case "out_of_stock":
        return {
          text: "Out of Stock",
          class: "bg-red-100 text-red-800",
          dot: "bg-red-500",
        };
      default:
        return {
          text: "Unknown",
          class: "bg-gray-100 text-gray-800",
          dot: "bg-gray-500",
        };
    }
  };

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-red-100 flex items-center justify-center mb-4">
            <ArrowPathIcon className="h-10 w-10 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            Failed to load products
          </h3>
          <p className="text-gray-500 mt-2">Please try again</p>
          <button
            onClick={() => refetch()}
            className="mt-4 inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <ArrowPathIcon className="h-4 w-4 mr-2" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Check if we have no products
  const hasProducts =
    productsData?.products && productsData.products.length > 0;
  const totalProducts = productsData?.total || 0;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-gray-900 to-black rounded-2xl p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Products</h1>
            <p className="text-gray-300 mt-1">
              Manage your farm produce inventory
            </p>
          </div>
          <button
            onClick={() => {
              setSelectedProduct(null);
              setIsFormOpen(true);
            }}
            className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200"
          >
            <PlusIcon className="-ml-0.5 mr-2 h-5 w-5" />
            Add Product
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <p className="text-sm text-gray-300">Total Products</p>
            <p className="text-2xl font-bold mt-1">
              {isLoading ? "..." : totalProducts}
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <p className="text-sm text-gray-300">In Stock</p>
            <p className="text-2xl font-bold mt-1 text-green-400">
              {isLoading ? "..." : statsData?.inStock || 0}
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <p className="text-sm text-gray-300">Low Stock</p>
            <p className="text-2xl font-bold mt-1 text-yellow-400">
              {isLoading ? "..." : statsData?.lowStock || 0}
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <p className="text-sm text-gray-300">Catalog Synced</p>
            <p className="text-2xl font-bold mt-1 text-blue-400">
              {isLoading ? "..." : statsData?.catalogSynced || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Filter Tabs */}
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {statusFilters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => handleStatusFilter(filter.id)}
                className={`
                  inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap
                  ${
                    filters.status === filter.id ||
                    (filter.id === "all" && !filters.status)
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }
                `}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full md:w-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="search"
              placeholder="Search products..."
              className="block w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-200 p-6 animate-pulse"
            >
              <div className="h-48 bg-gray-200 rounded-xl mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !hasProducts && (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center mb-4">
            <CubeIcon className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            No products found
          </h3>
          <p className="text-gray-500 mt-2">
            {searchQuery
              ? `No products matching "${searchQuery}"`
              : filters.status && filters.status !== "all"
              ? `No products with status "${filters.status}"`
              : "Get started by adding your first product"}
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            {(searchQuery || filters.status) && (
              <button
                onClick={handleClearFilters}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Clear filters
              </button>
            )}
            <button
              onClick={() => {
                setSelectedProduct(null);
                setIsFormOpen(true);
              }}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-colors"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add First Product
            </button>
          </div>

          {/* Quick tips for new users */}
          {!searchQuery && !filters.status && totalProducts === 0 && (
            <div className="mt-8 pt-8 border-t border-gray-100">
              <h4 className="text-sm font-medium text-gray-900 mb-3">
                Quick Start Tips
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <TagIcon className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Add Products
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Start by adding your farm produce items
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <ShoppingBagIcon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Set Prices
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Add catalog and checkout prices for WhatsApp integration
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <CubeIcon className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Upload Images
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Add clear photos to showcase your products
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Products Grid */}
      {!isLoading && hasProducts && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {productsData.products.map((product: any) => {
              const status = getStatusBadge(product.status);

              // For backward compatibility with old products that only have 'price'
              const displayPrice = product.price || product.price;
              const catalogRetailerId = product.catalogRetailerId;

              return (
                <div
                  key={product._id || product.id}
                  className="group bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Product Image */}
                  <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback if image fails to load
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 flex items-center justify-center">
                          <span className="text-3xl">🍅</span>
                        </div>
                      </div>
                    )}
                    <div className="absolute top-4 right-4 space-y-2">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${status.class}`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full mr-1.5 ${status.dot}`}
                        ></span>
                        {status.text}
                      </span>
                      {product.catalogProductId && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          📱 In Catalog
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-700 transition-colors line-clamp-1">
                          {product.name}
                        </h3>
                        <div className="flex items-center mt-1">
                          <span className="text-sm text-gray-500">
                            {product.category}
                          </span>
                          {product.syncToCatalog && (
                            <span className="ml-2 text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                              Synced
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Prices */}
                    <div className="mt-4 space-y-2">
                      <div className="flex items-baseline">
                        <span className="text-2xl font-bold text-gray-900">
                          ₦{displayPrice?.toLocaleString()}
                        </span>
                        <span className="text-sm text-gray-500 ml-2">
                          per {product.unit}
                        </span>
                      </div>
                    </div>

                    {/* Stock & Sales */}
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Stock</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {product.stock} units
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Sales</p>
                        <div className="flex items-center">
                          <p className="text-lg font-semibold text-gray-900">
                            {product.sales || 0}
                          </p>
                          {product.sales > 100 ? (
                            <ArrowTrendingUpIcon className="ml-2 h-5 w-5 text-green-500" />
                          ) : (
                            <ArrowTrendingDownIcon className="ml-2 h-5 w-5 text-red-500" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-6 flex items-center justify-between">
                      <button
                        onClick={() => handleEdit(product)}
                        className="inline-flex items-center text-sm font-medium text-green-600 hover:text-green-700 px-4 py-2 rounded-lg hover:bg-green-50 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product._id || product.id)}
                        disabled={deleteMutation.isPending}
                        className="inline-flex items-center text-sm font-medium text-red-600 hover:text-red-700 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                      >
                        {deleteMutation.isPending ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {productsData.totalPages > 1 && (
            <div className="flex items-center justify-between bg-white rounded-xl p-4">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{" "}
                  <span className="font-medium">
                    {productsData.products.length}
                  </span>{" "}
                  of <span className="font-medium">{productsData.total}</span>{" "}
                  products
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() =>
                    setFilters((prev) => ({ ...prev, page: prev.page! - 1 }))
                  }
                  disabled={filters.page === 1}
                  className="px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <button
                  onClick={() =>
                    setFilters((prev) => ({ ...prev, page: prev.page! + 1 }))
                  }
                  disabled={filters.page === productsData.totalPages}
                  className="px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Product Form Modal */}
      {isFormOpen && (
        <ProductForm
          product={selectedProduct}
          onClose={() => {
            setIsFormOpen(false);
            setSelectedProduct(null);
          }}
          onSubmit={handleFormSubmit}
          isSubmitting={createMutation.isPending || updateMutation.isPending}
        />
      )}
    </div>
  );
}
