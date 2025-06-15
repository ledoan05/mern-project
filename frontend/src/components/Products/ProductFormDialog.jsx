import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { uploadImageAPI } from "@/untils/uploadImage";

export default function ProductFormDialog({
  open,
  onClose,
  initialValues,
  onSubmit,
}) {
  const [form, setForm] = useState(
    initialValues || {
      name: "",
      price: "",
      countInStock: "",
      sizes: [],
      colors: [],
      images: [],
      sku: "",
      category: "",
      brand: "",
      collections: "",
      isFeatured: false,
      isPublished: false,
      description: "",
    }
  );
  const [uploading, setUploading] = useState(false);

  // Upload nhiều ảnh
  const handleImageUpload = async (e) => {
    setUploading(true);
    try {
      const files = Array.from(e.target.files);
      const urls = [];
      for (const file of files) {
        const { url } = await uploadImageAPI(file);
        urls.push({ url });
      }
      setForm((f) => ({ ...f, images: [...f.images, ...urls] }));
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (idx) => {
    setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== idx) }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{form._id ? "Sửa" : "Thêm"} sản phẩm</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(form);
          }}
          className="space-y-3"
        >
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label>Tên sản phẩm</Label>
              <Input
                required
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
              />
            </div>
            <div>
              <Label>Giá</Label>
              <Input
                required
                type="number"
                value={form.price}
                onChange={(e) =>
                  setForm((f) => ({ ...f, price: e.target.value }))
                }
              />
            </div>
            <div>
              <Label>Kho</Label>
              <Input
                required
                type="number"
                value={form.countInStock}
                onChange={(e) =>
                  setForm((f) => ({ ...f, countInStock: e.target.value }))
                }
              />
            </div>
            <div>
              <Label>SKU</Label>
              <Input
                required
                value={form.sku}
                onChange={(e) =>
                  setForm((f) => ({ ...f, sku: e.target.value }))
                }
              />
            </div>
            <div>
              <Label>Danh mục</Label>
              <Input
                required
                value={form.category}
                onChange={(e) =>
                  setForm((f) => ({ ...f, category: e.target.value }))
                }
              />
            </div>
            <div>
              <Label>Thương hiệu</Label>
              <Input
                value={form.brand}
                onChange={(e) =>
                  setForm((f) => ({ ...f, brand: e.target.value }))
                }
              />
            </div>
            <div>
              <Label>Bộ sưu tập</Label>
              <Input
                required
                value={form.collections}
                onChange={(e) =>
                  setForm((f) => ({ ...f, collections: e.target.value }))
                }
              />
            </div>
            <div>
              <Label>Sizes (cách nhau bởi dấu phẩy ,)</Label>
              <Input
                value={form.sizes?.join(",")}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    sizes: e.target.value.split(",").map((x) => x.trim()),
                  }))
                }
              />
            </div>
            <div>
              <Label>Colors (cách nhau bởi dấu phẩy ,)</Label>
              <Input
                value={form.colors?.join(",")}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    colors: e.target.value.split(",").map((x) => x.trim()),
                  }))
                }
              />
            </div>
          </div>
          {/* Mô tả */}
          <div>
            <Label>Mô tả</Label>
            <Textarea
              required
              rows={4}
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              placeholder="Nhập mô tả sản phẩm"
              className="resize-y"
            />
          </div>
          {/* Ảnh */}
          <div>
            <Label>Hình ảnh</Label>
            <Input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
            />
            {uploading && (
              <div className="text-blue-500 text-xs mt-1">Đang tải ảnh...</div>
            )}
            <div className="flex flex-wrap gap-2 mt-2">
              {form.images?.map((img, idx) => (
                <div key={idx} className="relative">
                  <img
                    src={img.url}
                    alt=""
                    className="w-14 h-14 object-cover rounded border"
                  />
                  <Button
                    size="icon"
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute -top-2 -right-2 bg-white hover:bg-red-100 border border-red-300 text-red-600"
                  >
                    ×
                  </Button>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">{form._id ? "Lưu" : "Thêm"}</Button>
            <Button type="button" variant="secondary" onClick={onClose}>
              Huỷ
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
