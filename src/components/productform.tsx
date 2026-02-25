// components/ProductForm.tsx - UPDATED VERSION
"use client";

import { useState, useCallback } from "react";
import {
  XMarkIcon,
  PhotoIcon,
  VideoCameraIcon,
} from "@heroicons/react/24/outline";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import toast from "react-hot-toast";

/* ----------------------------- */
/* Schema */
/* ----------------------------- */

const productSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters"),
  description: z.string().optional(),
  category: z.string().min(1, "Please select a category"),
  catalogRetailerId: z.string().min(1, "Catalog retailer Id is required"),
  price: z
    .string()
    .min(1, "Checkout price is required")
    .regex(/^\d+$/, "Checkout price must be a valid number"),
  stock: z
    .string()
    .min(1, "Stock is required")
    .regex(/^\d+$/, "Stock must be a valid number"),
  unit: z.string().min(1, "Unit is required"),
  images: z.array(z.string()).min(1, "At least one image is required"),
  videos: z.array(z.string()).optional(),
  isActive: z.boolean(),
  syncToCatalog: z.boolean().optional().default(true),
});

export type ProductFormData = z.infer<typeof productSchema>;

/* ----------------------------- */
/* Props */
/* ----------------------------- */

interface ProductFormProps {
  product?: any | null;
  onClose: () => void;
  onSubmit: (data: ProductFormData) => Promise<void>;
  isSubmitting?: boolean;
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
/* Cloudinary Configuration */
/* ----------------------------- */

const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET =
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

const uploadToCloudinary = async (
  file: File,
  type: "image" | "video"
): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append(
    "upload_preset",
    CLOUDINARY_UPLOAD_PRESET || "farmbot_products"
  );

  formData.append("resource_type", type === "video" ? "video" : "image");

  if (type === "image") {
    formData.append("quality", "auto");
    formData.append("fetch_format", "auto");
  }

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${
        type === "video" ? "video" : "image"
      }/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Upload failed");
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw error;
  }
};

/* ----------------------------- */
/* Component */
/* ----------------------------- */

export function ProductForm({
  product,
  onClose,
  onSubmit,
  isSubmitting = false,
}: ProductFormProps) {
  const [uploadingMedia, setUploadingMedia] = useState<{
    type: "image" | "video";
    index?: number;
  } | null>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: product
      ? {
          name: product.name || "",
          description: product.description || "",
          category: product.category || "",
          catalogRetailerId: product.catalogRetailerId,
          price: product.price?.toString() || product.price?.toString() || "",
          stock: product.stock?.toString() || "",
          unit: product.unit || "kg",
          images: product.images || [],
          videos: product.videos || [],
          isActive: product.isActive !== false,
          syncToCatalog: product.syncToCatalog !== false,
        }
      : {
          name: "",
          description: "",
          category: "",
          catalogRetailerId: "",
          price: "",
          stock: "",
          unit: "kg",
          images: [],
          videos: [],
          isActive: true,
          syncToCatalog: true,
        },
  });

  /* ----------------------------- */
  /* Media Upload Handlers */
  /* ----------------------------- */

  const handleMediaUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>, type: "image" | "video") => {
      const file = e.target.files?.[0];
      if (!file) return;

      const maxSize = type === "video" ? 50 * 1024 * 1024 : 5 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error(
          `${type === "video" ? "Video" : "Image"} is too large. Max size: ${
            type === "video" ? "50MB" : "5MB"
          }`
        );
        return;
      }

      const validImageTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/gif",
      ];
      const validVideoTypes = ["video/mp4", "video/webm", "video/ogg"];

      if (type === "image" && !validImageTypes.includes(file.type)) {
        toast.error("Please upload a valid image (JPEG, PNG, WebP, GIF)");
        return;
      }

      if (type === "video" && !validVideoTypes.includes(file.type)) {
        toast.error("Please upload a valid video (MP4, WebM, OGG)");
        return;
      }

      setUploadingMedia({ type });

      try {
        const url = await uploadToCloudinary(file, type);

        if (type === "image") {
          const currentImages = watch("images") || [];
          setValue("images", [...currentImages, url], {
            shouldValidate: true,
            shouldDirty: true,
          });
          toast.success("Image uploaded successfully!");
        } else {
          const currentVideos = watch("videos") || [];
          setValue("videos", [...currentVideos, url], {
            shouldValidate: true,
            shouldDirty: true,
          });
          toast.success("Video uploaded successfully!");
        }
      } catch (error) {
        toast.error(`Failed to upload ${type}. Please try again.`);
        console.error(`Upload error:`, error);
      } finally {
        setUploadingMedia(null);
        e.target.value = "";
      }
    },
    [setValue, watch]
  );

  const removeMedia = useCallback(
    (index: number, type: "image" | "video") => {
      if (type === "image") {
        const currentImages = watch("images") || [];
        setValue(
          "images",
          currentImages.filter((_, i) => i !== index),
          {
            shouldValidate: true,
            shouldDirty: true,
          }
        );
      } else {
        const currentVideos = watch("videos") || [];
        setValue(
          "videos",
          currentVideos.filter((_, i) => i !== index),
          {
            shouldValidate: true,
            shouldDirty: true,
          }
        );
      }
    },
    [setValue, watch]
  );

  const handleFormSubmit = async (data: ProductFormData) => {
    try {
      // Convert string prices to numbers
      const formattedData = {
        ...data,
        catalogRetailerId: data.catalogRetailerId,
        price: parseInt(data.price),
        stock: parseInt(data.stock),
      };
      await onSubmit(formattedData);
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  const formValues = watch();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4 text-center">
        {/* Backdrop */}
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
                      Product Images *
                    </h3>
                    <p className="text-sm text-gray-500">
                      Upload clear photos of your product. At least one image is
                      required.
                    </p>
                  </div>
                  <span className="text-xs text-gray-400">
                    Max 5 images • 5MB each
                  </span>
                </div>

                {errors.images && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <span>⚠</span> {errors.images.message}
                  </p>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Image Upload Card */}
                  <label
                    className={`
                    relative group flex flex-col items-center justify-center 
                    h-48 border-2 border-dashed rounded-xl cursor-pointer
                    transition-all duration-200
                    ${
                      uploadingMedia?.type === "image"
                        ? "bg-blue-50 border-blue-200"
                        : "bg-gray-50 border-gray-200 hover:border-green-300 hover:bg-green-50"
                    }
                  `}
                  >
                    <input
                      type="file"
                      className="hidden"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      onChange={(e) => handleMediaUpload(e, "image")}
                      disabled={
                        isSubmitting || uploadingMedia?.type === "image"
                      }
                    />
                    <div className="flex flex-col items-center justify-center space-y-3">
                      {uploadingMedia?.type === "image" ? (
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-500" />
                      ) : (
                        <>
                          <div className="p-3 bg-green-100 rounded-full">
                            <PhotoIcon className="h-6 w-6 text-green-600" />
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-medium text-gray-700">
                              Upload Image
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              JPEG, PNG, WebP
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </label>

                  {/* Image Previews */}
                  {(formValues.images || []).map((image, index) => (
                    <div
                      key={index}
                      className="relative group h-48 rounded-xl overflow-hidden bg-gray-100"
                    >
                      <img
                        src={image}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        alt={`Product ${index + 1}`}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "/api/placeholder/400/300";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <button
                        type="button"
                        onClick={() => removeMedia(index, "image")}
                        disabled={isSubmitting}
                        className="absolute top-3 right-3 bg-red-500 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 disabled:opacity-50"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 2: Product Videos */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Product Videos
                    </h3>
                    <p className="text-sm text-gray-500">
                      Optional: Upload short videos showcasing your product
                    </p>
                  </div>
                  <span className="text-xs text-gray-400">
                    Max 2 videos • 50MB each
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Video Upload Card */}
                  <label
                    className={`
                    relative group flex flex-col items-center justify-center 
                    h-48 border-2 border-dashed rounded-xl cursor-pointer
                    transition-all duration-200
                    ${
                      uploadingMedia?.type === "video"
                        ? "bg-blue-50 border-blue-200"
                        : "bg-gray-50 border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                    }
                  `}
                  >
                    <input
                      type="file"
                      className="hidden"
                      accept="video/mp4,video/webm,video/ogg"
                      onChange={(e) => handleMediaUpload(e, "video")}
                      disabled={
                        isSubmitting || uploadingMedia?.type === "video"
                      }
                    />
                    <div className="flex flex-col items-center justify-center space-y-3">
                      {uploadingMedia?.type === "video" ? (
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500" />
                      ) : (
                        <>
                          <div className="p-3 bg-blue-100 rounded-full">
                            <VideoCameraIcon className="h-6 w-6 text-blue-600" />
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-medium text-gray-700">
                              Upload Video
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              MP4, WebM, OGG
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </label>

                  {/* Video Previews */}
                  {(formValues.videos || []).map((video, index) => (
                    <div
                      key={index}
                      className="relative group h-48 rounded-xl overflow-hidden bg-gray-100"
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="p-4 bg-black/50 rounded-full">
                          <VideoCameraIcon className="h-8 w-8 text-white" />
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <button
                        type="button"
                        onClick={() => removeMedia(index, "video")}
                        disabled={isSubmitting}
                        className="absolute top-3 right-3 bg-red-500 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 disabled:opacity-50"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 3: Basic Information */}
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
                        focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none
                        ${
                          errors.name
                            ? "border-red-300 bg-red-50"
                            : "border-gray-200 hover:border-gray-300"
                        }
                      `}
                      disabled={isSubmitting}
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
                          focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none
                          ${
                            errors.category
                              ? "border-red-300 bg-red-50"
                              : "border-gray-200 hover:border-gray-300"
                          }
                        `}
                        disabled={isSubmitting}
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
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 hover:border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none resize-none"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              </div>

              {/* Section 4: Pricing & Inventory */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Pricing & Inventory
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {/* Catalog Price (Reference Price) */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Catalog Retailer ID
                    </label>
                    <div className="relative">
                      <input
                        {...register("catalogRetailerId")}
                        placeholder="0.00"
                        className={`
                          w-full pl-10 pr-4 py-3 rounded-lg border transition-colors
                          focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none
                          ${
                            errors.catalogRetailerId
                              ? "border-red-300 bg-red-50"
                              : "border-gray-200 hover:border-gray-300"
                          }
                        `}
                        disabled={isSubmitting}
                      />
                    </div>
                    {errors.catalogRetailerId && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <span>⚠</span> {errors.catalogRetailerId.message}
                      </p>
                    )}
                  </div>

                  {/* Checkout Price (Current Price) */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Checkout Price (₦) *
                      <span className="text-xs text-gray-500 ml-2">
                        Actual selling price
                      </span>
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
                          focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none
                          ${
                            errors.price
                              ? "border-red-300 bg-red-50"
                              : "border-gray-200 hover:border-gray-300"
                          }
                        `}
                        disabled={isSubmitting}
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
                        focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none
                        ${
                          errors.stock
                            ? "border-red-300 bg-red-50"
                            : "border-gray-200 hover:border-gray-300"
                        }
                      `}
                      disabled={isSubmitting}
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
                          focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none
                          ${
                            errors.unit
                              ? "border-red-300 bg-red-50"
                              : "border-gray-200 hover:border-gray-300"
                          }
                        `}
                        disabled={isSubmitting}
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

              {/* Section 5: WhatsApp Catalog Sync */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  WhatsApp Catalog Sync
                </h3>

                <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-xl">
                  <Controller
                    name="syncToCatalog"
                    control={control}
                    render={({ field }) => (
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                          className="sr-only peer"
                          disabled={isSubmitting}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 disabled:opacity-50"></div>
                      </label>
                    )}
                  />
                  <div>
                    <span className="font-medium text-gray-900">
                      Sync to WhatsApp Catalog
                    </span>
                    <p className="text-sm text-gray-500">
                      When enabled, this product will appear in your WhatsApp
                      Business catalog
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 6: Availability */}
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
                          disabled={isSubmitting}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600 disabled:opacity-50"></div>
                      </label>
                    )}
                  />
                  <div>
                    <span className="font-medium text-gray-900">
                      Product is available for purchase
                    </span>
                    <p className="text-sm text-gray-500">
                      When disabled, customers won&#39;t see this product
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 7: WhatsApp Preview */}
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
                        <div className="mt-2 space-y-2">
                          <div className="flex items-center text-sm text-gray-600">
                            <span className="font-medium">
                              Catalog Retailer ID:
                            </span>
                            <span className="ml-2 font-semibold text-green-700">
                              {formValues.catalogRetailerId}
                            </span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <span className="font-medium">Checkout Price:</span>
                            <span className="ml-2 font-semibold text-blue-700">
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
                            <span
                              className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${
                                formValues.syncToCatalog
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {formValues.syncToCatalog
                                ? "In WhatsApp Catalog 📱"
                                : "Not in Catalog"}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 mt-2">
                            📸 {formValues.images?.length || 0} photos
                            {formValues.videos?.length
                              ? ` • 🎬 ${formValues.videos.length} videos`
                              : ""}
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
                    disabled={
                      isSubmitting || !isDirty || !formValues.images?.length
                    }
                    className={`
                      px-8 py-3 rounded-lg font-medium transition-all
                      ${
                        isSubmitting || !isDirty || !formValues.images?.length
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
                        {product ? "Updating..." : "Creating..."}
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
