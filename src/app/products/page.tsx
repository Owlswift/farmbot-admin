/* eslint-disable @typescript-eslint/no-explicit-any */
// app/products/page.tsx
"use client";

import { useState } from "react";
import {
  PencilIcon,
  TrashIcon,
  PlusIcon,
  ShoppingBagIcon,
  TagIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  MagnifyingGlassIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/outline";
import { ProductForm } from "@/components/productform";

const products = [
  {
    id: 1,
    name: "Fresh Organic Tomatoes",
    category: "Vegetables",
    price: "₦1,500",
    originalPrice: "₦1,800",
    stock: 42,
    status: "in_stock",
    image: "/api/placeholder/400/300",
    sales: 124,
    rating: 4.8,
  },
  {
    id: 2,
    name: "Organic Potatoes",
    category: "Vegetables",
    price: "₦2,000",
    originalPrice: "₦2,400",
    stock: 8,
    status: "low_stock",
    image: "/api/placeholder/400/300",
    sales: 89,
    rating: 4.5,
  },
  {
    id: 3,
    name: "Farm Fresh Eggs (30pcs)",
    category: "Poultry",
    price: "₦3,500",
    originalPrice: null,
    stock: 0,
    status: "out_of_stock",
    image: "/api/placeholder/400/300",
    sales: 56,
    rating: 4.9,
  },
  {
    id: 4,
    name: "Fresh Spinach Bundle",
    category: "Leafy Greens",
    price: "₦800",
    originalPrice: "₦1,000",
    stock: 56,
    status: "in_stock",
    image: "/api/placeholder/400/300",
    sales: 203,
    rating: 4.7,
  },
  {
    id: 5,
    name: "Premium Carrots",
    category: "Vegetables",
    price: "₦1,200",
    originalPrice: null,
    stock: 24,
    status: "in_stock",
    image: "/api/placeholder/400/300",
    sales: 98,
    rating: 4.6,
  },
  {
    id: 6,
    name: "Organic Onions (1kg)",
    category: "Vegetables",
    price: "₦900",
    originalPrice: "₦1,200",
    stock: 15,
    status: "low_stock",
    image: "/api/placeholder/400/300",
    sales: 76,
    rating: 4.4,
  },
];

const filters = [
  { id: "all", label: "All Products" },
  { id: "in_stock", label: "In Stock", count: 3 },
  { id: "low_stock", label: "Low Stock", count: 2 },
  { id: "out_of_stock", label: "Out of Stock", count: 1 },
];

export default function ProductsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const handleEdit = (product: any) => {
    setSelectedProduct(product);
    setIsFormOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      // Handle delete
      console.log("Delete product:", id);
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

  const filteredProducts = products.filter((product) => {
    if (activeFilter !== "all" && product.status !== activeFilter) return false;
    if (
      searchQuery &&
      !product.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    return true;
  });

  const stats = {
    total: products.length,
    inStock: products.filter((p) => p.status === "in_stock").length,
    lowStock: products.filter((p) => p.status === "low_stock").length,
    outOfStock: products.filter((p) => p.status === "out_of_stock").length,
    totalSales: products.reduce((sum, p) => sum + p.sales, 0),
  };

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
            <p className="text-2xl font-bold mt-1">{stats.total}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <p className="text-sm text-gray-300">In Stock</p>
            <p className="text-2xl font-bold mt-1 text-green-400">
              {stats.inStock}
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <p className="text-sm text-gray-300">Low Stock</p>
            <p className="text-2xl font-bold mt-1 text-yellow-400">
              {stats.lowStock}
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <p className="text-sm text-gray-300">Total Sales</p>
            <p className="text-2xl font-bold mt-1">{stats.totalSales}</p>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Filter Tabs */}
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`
                  inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap
                  ${
                    activeFilter === filter.id
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }
                `}
              >
                {filter.label}
                {filter.count && (
                  <span
                    className={`ml-2 px-1.5 py-0.5 text-xs rounded-full ${
                      activeFilter === filter.id ? "bg-white/30" : "bg-gray-300"
                    }`}
                  >
                    {filter.count}
                  </span>
                )}
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
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => {
          const status = getStatusBadge(product.status);

          return (
            <div
              key={product.id}
              className="group bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Product Image */}
              <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 flex items-center justify-center">
                    <span className="text-3xl">🍅</span>
                  </div>
                </div>
                <div className="absolute top-4 right-4">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${status.class}`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full mr-1.5 ${status.dot}`}
                    ></span>
                    {status.text}
                  </span>
                </div>
                <div className="absolute top-4 left-4">
                  <button className="p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    <EllipsisVerticalIcon className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-700 transition-colors">
                      {product.name}
                    </h3>
                    <div className="flex items-center mt-1">
                      <TagIcon className="h-4 w-4 text-gray-400 mr-1" />
                      <span className="text-sm text-gray-500">
                        {product.category}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Price */}
                <div className="mt-4">
                  <div className="flex items-baseline">
                    <span className="text-2xl font-bold text-gray-900">
                      {product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="ml-2 text-sm text-gray-500 line-through">
                        {product.originalPrice}
                      </span>
                    )}
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
                        {product.sales}
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
                    <PencilIcon className="mr-2 h-4 w-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="inline-flex items-center text-sm font-medium text-red-600 hover:text-red-700 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <TrashIcon className="mr-2 h-4 w-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center mb-4">
            <ShoppingBagIcon className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            No products found
          </h3>
          <p className="text-gray-500 mt-2">
            {searchQuery
              ? `No products matching "${searchQuery}"`
              : `No products in "${
                  filters.find((f) => f.id === activeFilter)?.label
                }"`}
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setActiveFilter("all");
            }}
            className="mt-4 text-sm font-medium text-green-600 hover:text-green-700"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Product Form Modal */}
      {isFormOpen && (
        <ProductForm
          product={selectedProduct}
          onClose={() => setIsFormOpen(false)}
          onSubmit={(data) => {
            console.log("Submit product:", data);
            setIsFormOpen(false);
          }}
        />
      )}
    </div>
  );
}
