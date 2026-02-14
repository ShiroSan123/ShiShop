import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { uploadProductImage } from "@/lib/supabase/storage";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Lock, Package, ShoppingBag, Star, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

/**
 * @typedef {Object} UpdateOrderPayload
 * @property {string} id
 * @property {"pending" | "confirmed" | "shipped" | "delivered" | "cancelled"} status
 */

/**
 * @typedef {Object} UpdateProductPayload
 * @property {string} id
 * @property {string} title
 * @property {"personal" | "china"} type
 * @property {"available" | "reserved" | "sold"} status
 * @property {number} price
 * @property {string} description
 */

/**
 * @typedef {Object} CreateProductPayload
 * @property {string} title
 * @property {string} slug
 * @property {"personal" | "china"} type
 * @property {"available" | "reserved" | "sold"} status
 * @property {number} price
 * @property {string} description
 * @property {string[]} images
 * @property {string} currency
 */

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [editingProductId, setEditingProductId] = useState(null);
  const [editProductForm, setEditProductForm] = useState({
    name: "",
    category: "personal",
    status: "available",
    price: 0,
    description: "",
  });
  const [newProductForm, setNewProductForm] = useState({
    name: "",
    category: "personal",
    status: "available",
    price: 0,
    description: "",
    imageUrl: "",
  });
  const [newProductImageFiles, setNewProductImageFiles] = useState([]);
  const [newProductPreviewUrls, setNewProductPreviewUrls] = useState([]);

  const queryClient = useQueryClient();

  const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || "admin";

  const { data: products = [] } = useQuery({
    queryKey: ["admin-products"],
    queryFn: () => base44.entities.Product.list("-created_date", 200),
    enabled: isAuthenticated,
  });

  const { data: orders = [] } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: () => base44.entities.Order.list("-created_date", 200),
    enabled: isAuthenticated,
  });

  const { data: reviews = [] } = useQuery({
    queryKey: ["admin-reviews"],
    queryFn: () => base44.entities.Review.list("-created_date", 200),
    enabled: isAuthenticated,
  });

  const updateOrderMutation = useMutation({
    /** @param {UpdateOrderPayload} payload */
    mutationFn: (payload) =>
      base44.entities.Order.update(payload.id, { status: payload.status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      toast.success("Status updated");
    },
  });

  const updateProductMutation = useMutation({
    /** @param {UpdateProductPayload} payload */
    mutationFn: (payload) =>
      base44.entities.Product.update(payload.id, {
        title: payload.title,
        type: payload.type,
        status: payload.status,
        price: payload.price,
        description: payload.description,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      setEditingProductId(null);
      toast.success("Product updated");
    },
    onError: () => {
      toast.error("Failed to update product");
    },
  });

  const createProductMutation = useMutation({
    mutationFn: async () => {
      const name = newProductForm.name.trim();
      if (!name) {
        throw new Error("Product name is required");
      }

      const uploadedImageUrls =
        newProductImageFiles.length > 0
          ? await Promise.all(newProductImageFiles.map((file) => uploadProductImage(file)))
          : [];

      const manualImageUrls = newProductForm.imageUrl
        .split(/[\n,]/)
        .map((url) => url.trim())
        .filter(Boolean);

      const finalImages = [...uploadedImageUrls, ...manualImageUrls];

      const slug = name
        .toLowerCase()
        .replace(/[^\p{L}\p{N}\s-]/gu, "")
        .trim()
        .replace(/\s+/g, "-");

      const payload =
        /** @type {CreateProductPayload} */ ({
          title: name,
          slug: slug || `product-${Date.now()}`,
          type: newProductForm.category,
          status: newProductForm.status,
          price: Number(newProductForm.price || 0),
          description: newProductForm.description || "",
          images: finalImages,
          currency: "RUB",
        });

      return base44.entities.Product.create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      setNewProductForm({
        name: "",
        category: "personal",
        status: "available",
        price: 0,
        description: "",
        imageUrl: "",
      });
      setNewProductImageFiles([]);
      toast.success("Product added");
    },
    onError: (error) => {
      toast.error(error?.message || "Failed to add product");
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: (id) => base44.entities.Product.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      toast.success("Product deleted");
    },
  });

  const deleteReviewMutation = useMutation({
    mutationFn: (id) => base44.entities.Review.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
      toast.success("Review deleted");
    },
  });

  useEffect(() => {
    const objectUrls = newProductImageFiles.map((file) => URL.createObjectURL(file));
    const manualImageUrls = newProductForm.imageUrl
      .split(/[\n,]/)
      .map((url) => url.trim())
      .filter(Boolean);

    setNewProductPreviewUrls([...objectUrls, ...manualImageUrls]);

    return () => {
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [newProductImageFiles, newProductForm.imageUrl]);

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      toast.success("Welcome to admin panel");
    } else {
      toast.error("Wrong password");
    }
  };

  const startEditProduct = (product) => {
    setEditingProductId(product.id);
    setEditProductForm({
      name: product.name || product.title || "",
      category: product.category || product.type || "personal",
      status: product.status || "available",
      price: Number(product.price || 0),
      description: product.description || "",
    });
  };

  const cancelEditProduct = () => {
    setEditingProductId(null);
  };

  const saveEditedProduct = () => {
    if (!editingProductId) return;

    updateProductMutation.mutate(
      /** @type {UpdateProductPayload} */ ({
        id: editingProductId,
        title: editProductForm.name.trim(),
        type: editProductForm.category,
        status: editProductForm.status,
        price: Number(editProductForm.price || 0),
        description: editProductForm.description,
      }),
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 pt-24 flex items-center justify-center">
        <Card className="w-full max-w-md p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-900 flex items-center justify-center">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Admin Panel</h1>
            <p className="text-slate-600">Enter password to continue</p>
          </div>
          <div className="space-y-4">
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleLogin()}
              className="h-12"
            />
            <Button onClick={handleLogin} className="w-full h-12">
              Login
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const statusLabels = {
    pending: "Pending",
    confirmed: "Confirmed",
    shipped: "Shipped",
    delivered: "Delivered",
    cancelled: "Cancelled",
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-slate-900">Admin Panel</h1>
          <Button variant="outline" onClick={() => setIsAuthenticated(false)}>
            Logout
          </Button>
        </div>

        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="orders">
              <ShoppingBag className="w-4 h-4 mr-2" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="products">
              <Package className="w-4 h-4 mr-2" />
              Products
            </TabsTrigger>
            <TabsTrigger value="reviews">
              <Star className="w-4 h-4 mr-2" />
              Reviews
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">Manage orders</h2>
            {orders.map((order) => (
              <Card key={order.id} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">Order #{order.order_number}</h3>
                    <p className="text-sm text-slate-500">{order.customer_email}</p>
                    <p className="text-sm text-slate-500">
                      {order.items.length} items - {order.total} RUB
                    </p>
                  </div>
                  <Select
                    value={order.status}
                    onValueChange={(status) =>
                      updateOrderMutation.mutate(
                        /** @type {UpdateOrderPayload} */ ({ id: order.id, status }),
                      )
                    }
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(statusLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 text-sm">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-slate-600">
                      <span>
                        {item.product_name} x{item.quantity}
                      </span>
                      <span>{(item.product_price * item.quantity).toLocaleString("ru-RU")} RUB</span>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="products" className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">Manage products</h2>

            <Card className="p-4 space-y-4">
              <h3 className="font-semibold text-slate-900">Add product</h3>
              <div className="grid md:grid-cols-2 gap-3">
                <Input
                  value={newProductForm.name}
                  onChange={(e) =>
                    setNewProductForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Name"
                />
                <Input
                  type="number"
                  min="0"
                  value={newProductForm.price}
                  onChange={(e) =>
                    setNewProductForm((prev) => ({
                      ...prev,
                      price: Number(e.target.value || 0),
                    }))
                  }
                  placeholder="Price"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                <Select
                  value={newProductForm.category}
                  onValueChange={(value) =>
                    setNewProductForm((prev) => ({ ...prev, category: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="personal">personal</SelectItem>
                    <SelectItem value="china">china</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={newProductForm.status}
                  onValueChange={(value) =>
                    setNewProductForm((prev) => ({ ...prev, status: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">available</SelectItem>
                    <SelectItem value="reserved">reserved</SelectItem>
                    <SelectItem value="sold">sold</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                <Input
                  type="file"
                  multiple
                  accept="image/png,image/jpeg,image/webp"
                  onChange={(e) =>
                    setNewProductImageFiles(e.target.files ? Array.from(e.target.files) : [])
                  }
                />
                <Input
                  value={newProductForm.imageUrl}
                  onChange={(e) =>
                    setNewProductForm((prev) => ({ ...prev, imageUrl: e.target.value }))
                  }
                  placeholder="Or image URL(s), comma or new line"
                />
              </div>

              {newProductPreviewUrls.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm text-slate-600">Image preview</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {newProductPreviewUrls.map((url, index) => (
                      <div
                        key={`${url}-${index}`}
                        className="aspect-square rounded-lg overflow-hidden border"
                      >
                        <img
                          src={url}
                          alt={`preview-${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Textarea
                value={newProductForm.description}
                onChange={(e) =>
                  setNewProductForm((prev) => ({ ...prev, description: e.target.value }))
                }
                placeholder="Description"
                className="min-h-24"
              />

              <Button
                onClick={() => createProductMutation.mutate()}
                disabled={createProductMutation.isPending}
              >
                {createProductMutation.isPending ? "Adding..." : "Add product"}
              </Button>
            </Card>

            <div className="grid gap-4">
              {products.map((product) => (
                <Card key={product.id} className="p-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={
                        product.images?.[0] ||
                        "https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=100"
                      }
                      alt={product.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900">{product.name}</h3>
                      <p className="text-sm text-slate-500">
                        {product.price} RUB - {product.category}
                      </p>
                      <Badge className="mt-1">{product.status}</Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => startEditProduct(product)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-red-500"
                        onClick={() => deleteProductMutation.mutate(product.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {editingProductId === product.id && (
                    <div className="mt-4 pt-4 border-t space-y-4">
                      <div className="grid md:grid-cols-2 gap-3">
                        <Input
                          value={editProductForm.name}
                          onChange={(e) =>
                            setEditProductForm((prev) => ({ ...prev, name: e.target.value }))
                          }
                          placeholder="Name"
                        />
                        <Input
                          type="number"
                          min="0"
                          value={editProductForm.price}
                          onChange={(e) =>
                            setEditProductForm((prev) => ({
                              ...prev,
                              price: Number(e.target.value || 0),
                            }))
                          }
                          placeholder="Price"
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-3">
                        <Select
                          value={editProductForm.category}
                          onValueChange={(value) =>
                            setEditProductForm((prev) => ({ ...prev, category: value }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="personal">personal</SelectItem>
                            <SelectItem value="china">china</SelectItem>
                          </SelectContent>
                        </Select>

                        <Select
                          value={editProductForm.status}
                          onValueChange={(value) =>
                            setEditProductForm((prev) => ({ ...prev, status: value }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="available">available</SelectItem>
                            <SelectItem value="reserved">reserved</SelectItem>
                            <SelectItem value="sold">sold</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <Textarea
                        value={editProductForm.description}
                        onChange={(e) =>
                          setEditProductForm((prev) => ({ ...prev, description: e.target.value }))
                        }
                        placeholder="Description"
                        className="min-h-24"
                      />

                      <div className="flex gap-2">
                        <Button
                          onClick={saveEditedProduct}
                          disabled={updateProductMutation.isPending}
                        >
                          Save
                        </Button>
                        <Button variant="outline" onClick={cancelEditProduct}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">Manage reviews</h2>
            {reviews.map((review) => (
              <Card key={review.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold">{review.author_name}</span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-slate-300"}`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-slate-600">{review.comment}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    className="text-red-500"
                    onClick={() => deleteReviewMutation.mutate(review.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
