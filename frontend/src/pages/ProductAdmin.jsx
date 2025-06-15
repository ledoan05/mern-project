// pages/ProductAdminPage.jsx
import { useEffect, useState } from "react";
import { toast } from "sonner";
import ProductFormDialog from "@/components/Products/ProductFormDialog";
import {
  addProduct,
  deleteProduct,
  fetchProduct,
  updateProduct,
} from "@/redux/slices/productAdminSlice";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
} from "@/components/ui/table";

export default function ProductAdminPage() {
  const dispatch = useDispatch();
  const {
    products = [],
    loading,
    error,
  } = useSelector((state) => state.adminProduct || {});
  const [openForm, setOpenForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    dispatch(fetchProduct());
  }, [dispatch]);

  const handleSubmit = async (data) => {
    try {
      if (editingProduct) {
        await dispatch(
          updateProduct({ id: editingProduct._id, product: data })
        ).unwrap();
        toast.success("Cập nhật sản phẩm thành công!");
      } else {
        await dispatch(addProduct(data)).unwrap();
        toast.success("Thêm sản phẩm thành công!");
      }
      setOpenForm(false);
      setEditingProduct(null);
    } catch (err) {
      console.log(err);
      toast.error("Lỗi thao tác sản phẩm!");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Xác nhận xoá sản phẩm này?")) return;
    try {
      await dispatch(deleteProduct(id)).unwrap();
      toast.success("Xoá thành công!");
    } catch {
      toast.error("Lỗi khi xoá sản phẩm!");
    }
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Quản lý sản phẩm</h2>
        <Button
          onClick={() => {
            setEditingProduct(null);
            setOpenForm(true);
          }}
        >
          + Thêm sản phẩm
        </Button>
      </div>
      {loading && <div>Đang tải...</div>}
      {error && <div className="text-red-500">{error}</div>}
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tên</TableHead>
              <TableHead>Giá</TableHead>
              <TableHead>Kho</TableHead>
              <TableHead>Ảnh</TableHead>
              <TableHead>Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((p) => (
              <TableRow key={p._id}>
                <TableCell>{p.name}</TableCell>
                <TableCell>{Number(p.price)?.toLocaleString()}</TableCell>
                <TableCell>{p.countInStock}</TableCell>
                <TableCell>
                  {p.images?.[0]?.url && (
                    <img
                      src={p.images[0].url}
                      alt=""
                      className="w-10 h-10 object-cover rounded"
                    />
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mr-2"
                    onClick={() => {
                      setEditingProduct(p);
                      setOpenForm(true);
                    }}
                  >
                    Sửa
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(p._id)}
                  >
                    Xoá
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      {openForm && (
        <ProductFormDialog
          open={openForm}
          onClose={() => {
            setOpenForm(false);
            setEditingProduct(null);
          }}
          initialValues={editingProduct}
          onSubmit={handleSubmit}
        />
      )}
    </Card>
  );
}
