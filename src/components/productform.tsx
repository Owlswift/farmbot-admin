/* eslint-disable @typescript-eslint/no-explicit-any */
// components/ProductForm.tsx
"use client";

import { useState, useCallback } from "react";
import {
  XMarkIcon,
  PhotoIcon,
  CloudArrowUpIcon,
} from "@heroicons/react/24/outline";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

/* ----------------------------- */
/* Schema */
/* ----------------------------- */

const productSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters"),
  description: z.string().optional(),
  category: z.string().min(1, "Please select a category"),
  price: z
    .string()
    .min(1, "Price is required")
    .regex(/^\d+$/, "Price must be a valid number"),
  stock: z
    .string()
    .min(1, "Stock is required")
    .regex(/^\d+$/, "Stock must be a valid number"),
  unit: z.string().min(1, "Unit is required"),
  images: z.array(z.string()).optional(),
  isActive: z.boolean(),
});

export type ProductFormData = z.infer<typeof productSchema>;

/* ----------------------------- */
/* Props */
/* ----------------------------- */

interface ProductFormProps {
  product?: any | null;
  onClose: () => void;
  onSubmit: (data: ProductFormData) => Promise<void> | void;
}

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

const units = [
  { value: "kg", label: "Kilogram (kg)" },
  { value: "g", label: "Gram (g)" },
  { value: "piece", label: "Piece" },
  { value: "bunch", label: "Bunch" },
  { value: "bag", label: "Bag" },
  { value: "crate", label: "Crate" },
  { value: "dozen", label: "Dozen" },
];

/* ----------------------------- */
/* Component */
/* ----------------------------- */

export function ProductForm({ product, onClose, onSubmit }: ProductFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    setValue,
    formState: { errors, isDirty },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
      price: "",
      stock: "",
      unit: "kg",
      images: [],
      isActive: true,
    },
  });

  /* ----------------------------- */
  /* Image Upload */
  /* ----------------------------- */

  const handleImageUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setUploadingImage(true);
      const reader = new FileReader();

      reader.onloadend = () => {
        const currentImages = watch("images") ?? [];
        setValue("images", [...currentImages, reader.result as string], {
          shouldDirty: true,
        });
        setUploadingImage(false);
      };

      reader.readAsDataURL(file);
    },
    [setValue, watch]
  );

  const removeImage = useCallback(
    (index: number) => {
      const currentImages = watch("images") ?? [];
      setValue(
        "images",
        currentImages.filter((_, i) => i !== index),
        { shouldDirty: true }
      );
    },
    [setValue, watch]
  );

  /* ----------------------------- */
  /* Submit */
  /* ----------------------------- */

  const handleFormSubmit = async (data: ProductFormData) => {
    try {
      setIsSubmitting(true);
      await onSubmit(data);
    } catch (error) {
      console.error("Submit error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formValues = watch();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4 text-center">
        {/* Backdrop with blur effect */}
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Modal Container */}
        <div className="relative w-full max-w-4xl rounded-2xl bg-white shadow-2xl transform transition-all">
          {/* Header */}
          <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-8 py-6 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {product ? "Edit Product" : "Add New Product"}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  {product
                    ? "Update product details and availability"
                    : "Add a new product to your farm inventory"}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Form Content */}
          <div className="px-8 py-6 max-h-[calc(100vh-200px)] overflow-y-auto">
            <form
              onSubmit={handleSubmit(handleFormSubmit)}
              className="space-y-8"
            >
              {/* Section 1: Product Images */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Product Images
                    </h3>
                    <p className="text-sm text-gray-500">
                      Upload clear photos of your product
                    </p>
                  </div>
                  <span className="text-xs text-gray-400">Max 5 images</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Upload Card */}
                  <label
                    className={`
                    relative group flex flex-col items-center justify-center 
                    h-48 border-2 border-dashed rounded-xl cursor-pointer
                    transition-all duration-200
                    ${
                      uploadingImage
                        ? "bg-blue-50 border-blue-200"
                        : "bg-gray-50 border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                    }
                  `}
                  >
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isSubmitting || uploadingImage}
                    />
                    <div className="flex flex-col items-center justify-center space-y-3">
                      {uploadingImage ? (
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500" />
                      ) : (
                        <>
                          <div className="p-3 bg-blue-100 rounded-full">
                            <CloudArrowUpIcon className="h-6 w-6 text-blue-600" />
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-medium text-gray-700">
                              Upload Image
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              PNG, JPG, WEBP
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </label>

                  {/* Image Previews */}
                  {(formValues.images ?? []).map((image, index) => (
                    <div
                      key={index}
                      className="relative group h-48 rounded-xl overflow-hidden bg-gray-100"
                    >
                      <img
                        src={image}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        alt={`Product ${index + 1}`}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-3 right-3 bg-red-500 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 2: Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Basic Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Product Name */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Product Name *
                    </label>
                    <input
                      {...register("name")}
                      placeholder="e.g., Fresh Organic Tomatoes"
                      className={`
                        w-full px-4 py-3 rounded-lg border transition-colors
                        focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none
                        ${
                          errors.name
                            ? "border-red-300 bg-red-50"
                            : "border-gray-200 hover:border-gray-300"
                        }
                      `}
                    />
                    {errors.name && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <span>⚠</span> {errors.name.message}
                      </p>
                    )}
                  </div>

                  {/* Category */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Category *
                    </label>
                    <div className="relative">
                      <select
                        {...register("category")}
                        className={`
                          w-full px-4 py-3 rounded-lg border appearance-none bg-white
                          focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none
                          ${
                            errors.category
                              ? "border-red-300 bg-red-50"
                              : "border-gray-200 hover:border-gray-300"
                          }
                        `}
                      >
                        <option value="">Select category</option>
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <svg
                          className="w-5 h-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                    {errors.category && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <span>⚠</span> {errors.category.message}
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  <div className="md:col-span-2 space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      {...register("description")}
                      rows={3}
                      placeholder="Describe your product (quality, source, special features)"
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 hover:border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Pricing & Inventory */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Pricing & Inventory
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Price */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Price (₦) *
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        ₦
                      </div>
                      <input
                        {...register("price")}
                        placeholder="0.00"
                        className={`
                          w-full pl-10 pr-4 py-3 rounded-lg border transition-colors
                          focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none
                          ${
                            errors.price
                              ? "border-red-300 bg-red-50"
                              : "border-gray-200 hover:border-gray-300"
                          }
                        `}
                      />
                    </div>
                    {errors.price && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <span>⚠</span> {errors.price.message}
                      </p>
                    )}
                  </div>

                  {/* Stock */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Stock Quantity *
                    </label>
                    <input
                      {...register("stock")}
                      placeholder="e.g., 100"
                      className={`
                        w-full px-4 py-3 rounded-lg border transition-colors
                        focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none
                        ${
                          errors.stock
                            ? "border-red-300 bg-red-50"
                            : "border-gray-200 hover:border-gray-300"
                        }
                      `}
                    />
                    {errors.stock && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <span>⚠</span> {errors.stock.message}
                      </p>
                    )}
                  </div>

                  {/* Unit */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Unit *
                    </label>
                    <div className="relative">
                      <select
                        {...register("unit")}
                        className={`
                          w-full px-4 py-3 rounded-lg border appearance-none bg-white
                          focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none
                          ${
                            errors.unit
                              ? "border-red-300 bg-red-50"
                              : "border-gray-200 hover:border-gray-300"
                          }
                        `}
                      >
                        {units.map((unit) => (
                          <option key={unit.value} value={unit.value}>
                            {unit.label}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <svg
                          className="w-5 h-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                    {errors.unit && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <span>⚠</span> {errors.unit.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Section 4: Availability */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Availability
                </h3>

                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                  <Controller
                    name="isActive"
                    control={control}
                    render={({ field }) => (
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                      </label>
                    )}
                  />
                  <div>
                    <span className="font-medium text-gray-900">
                      Product is available for purchase
                    </span>
                    <p className="text-sm text-gray-500">
                      When disabled, customers won&#39;t see this product in
                      WhatsApp bot
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 5: WhatsApp Preview */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  WhatsApp Preview
                </h3>

                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
                  <div className="flex items-start space-x-3 mb-4">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <svg
                        className="w-5 h-5 text-green-600"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-green-800">
                        WhatsApp Bot Preview
                      </p>
                      <p className="text-sm text-green-600">
                        How customers will see this product in WhatsApp
                      </p>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4 border border-green-100 shadow-sm">
                    <div className="flex items-start space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center">
                        <span className="text-xl">🍅</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">
                          {formValues.name || "Product Name"}
                        </h4>
                        <div className="mt-2 space-y-1">
                          <div className="flex items-center text-sm text-gray-600">
                            <span className="font-medium">Price:</span>
                            <span className="ml-2 font-semibold text-green-700">
                              ₦
                              {formValues.price
                                ? parseInt(formValues.price).toLocaleString()
                                : "0"}
                              /{formValues.unit}
                            </span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <span className="font-medium">Status:</span>
                            <span
                              className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${
                                formValues.isActive
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {formValues.isActive
                                ? "Available ✅"
                                : "Not Available ❌"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="sticky bottom-0 bg-white border-t border-gray-100 px-8 py-6 -mx-8 -mb-6 rounded-b-2xl">
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={isSubmitting}
                    className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !isDirty}
                    className={`
                      px-8 py-3 rounded-lg font-medium transition-all
                      ${
                        isSubmitting || !isDirty
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:shadow-lg hover:shadow-green-200"
                      }
                    `}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <svg
                          className="animate-spin h-5 w-5"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                          />
                        </svg>
                        Saving...
                      </span>
                    ) : product ? (
                      "Update Product"
                    ) : (
                      "Add Product to Inventory"
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
