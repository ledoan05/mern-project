import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
  TableHead,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { addUser, deleteUser, fetchUser, updateUser } from "@/redux/slices/adminSlice";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function UserAdminPage() {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.admin);
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  // Xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (edit) {
        const submitData = { ...form };
        if (!form.password) delete submitData.password;
        await dispatch(
          updateUser({ ...submitData, id: edit.id || edit._id })
        ).unwrap();
        // Refetch lại user để chắc chắn list mới nhất
        dispatch(fetchUser());
        toast.success("Cập nhật người dùng thành công!");
      } else {
        await dispatch(addUser(form)).unwrap();
        dispatch(fetchUser());
        toast.success("Tạo mới người dùng thành công!");
      }
      setOpen(false);
      setEdit(null);
      setForm({ name: "", email: "", password: "", role: "user" });
    } catch (err) {
      toast.error(err?.message || "Có lỗi xảy ra, vui lòng thử lại!");
    }
  };
  

  // Khi nhấn Sửa
  const handleEdit = (user) => {
    setEdit(user);
    setForm({
      name: user.name || "",
      email: user.email || "",
      password: "",
      role: user.role || "user",
    });
    setOpen(true);
  };

  // Khi nhấn Thêm mới
  const handleAddNew = () => {
    setEdit(null);
    setForm({ name: "", email: "", password: "", role: "user" });
    setOpen(true);
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Quản lý người dùng</h2>
      <Button onClick={handleAddNew}>Thêm mới</Button>
      <Table className="mt-4">
        <TableHeader>
          <TableRow>
            <TableHead>Tên</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Vai trò</TableHead>
            <TableHead>Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id || user._id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  onClick={() => handleEdit(user)}
                  className="mr-2"
                >
                  Sửa
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => dispatch(deleteUser(user.id || user._id))}
                >
                  Xoá
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {loading && <div>Đang tải...</div>}
      {error && <div className="text-red-500">{error}</div>}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild />
        <DialogContent>
          <DialogTitle>
            {edit ? "Sửa người dùng" : "Thêm mới người dùng"}
          </DialogTitle>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-2">
            <Input
              placeholder="Tên"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <Input
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              type="email"
            />
            <Input
              placeholder="Mật khẩu"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required={!edit}
            />
            <Select
              value={form.role}
              onValueChange={(value) => setForm({ ...form, role: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn vai trò" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            <Button type="submit">{edit ? "Cập nhật" : "Tạo mới"}</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
