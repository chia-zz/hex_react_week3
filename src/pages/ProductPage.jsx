import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// API
import {
  getAdminProducts,
  checkUserLogin,
  deleteProduct,
  addProduct,
  updateProduct,
  adminLogout,
} from "../api/Api";
// 元件
import ProductModal from "../components/ProductModal";

function ProductPage() {
  const navigate = useNavigate();

  // 新增商品格式
  const addNewProduct = {
    title: "",
    category: "",
    origin_price: 0,
    price: 0,
    unit: "",
    description: "",
    content: "",
    is_enabled: 1,
    imageUrl: "",
    imagesUrl: [],
  };

  const [products, setProducts] = useState([]);
  const [tempProduct, setTempProduct] = useState(addNewProduct); // 之前是 null 但現在要存資料的格式
  // modal 設定
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState(null); // 'create' | 'edit'

  // API
  // 取得商品資料
  const getData = async () => {
    try {
      const res = await getAdminProducts();
      setProducts(Object.values(res.data.products));
      toast.success("資料載入成功！");
    } catch (error) {
      toast.error("取得資料失敗", error);
    }
  };
  // 檢查登入狀態
  const checkLogin = async () => {
    try {
      const res = await checkUserLogin();
      toast.success("登入成功", res.data);
    } catch (error) {
      toast.error("檢查失敗，請確認是否登入", error);
      navigate("/");
    }
  };
  useEffect(() => {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    if (!token) {
      toast.error("您尚未登入");
      navigate("/");
    } else {
      axios.defaults.headers.common["Authorization"] = token;
      getData();
    }
  }, []);

  const handleLogout = () => {
    try {
      const res = adminLogout();
      document.cookie = "hexToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
      axios.defaults.headers.common["Authorization"] = "";
      navigate("/");
    } catch (error) {
      toast.error("發生錯誤", error);
      navigate("/");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      toast.success("刪除成功");
      getData();
    } catch (error) {
      toast.error("刪除失敗", error);
    }
  };

  // modal

  const openModal = (mode, product) => {
    setModalMode(mode);
    if (mode === "create") {
      setTempProduct(addNewProduct);
    } else {
      setTempProduct(product);
    }
    setIsProductModalOpen(true);
  };

  const closeModal = () => {
    setIsProductModalOpen(false);
  };

  const handleModalInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    let finalValue = value;

    if (["price", "origin_price"].includes(name)) {
      finalValue = Number(value);
    } else if (name === "is_enabled") {
      finalValue = +value; // 轉數字
    } else if (type === "checkbox") {
      finalValue = checked ? 1 : 0;
    }
    setTempProduct((pre) => ({ ...pre, [name]: finalValue }));
  };

  // 多張圖片
  const handleImageChange = (index, value) => {
    setTempProduct((pre) => {
      const newImages = [...pre.imagesUrl]; // 複製新陣列
      newImages[index] = value; // 修改指定位置的值
      return { ...pre, imagesUrl: newImages }; // 更新回去
    });
  };
  // 新增多圖的圖片
  const handleAddImage = () => {
    setTempProduct((pre) => {
      const newImages = [...pre.imagesUrl, ""]; // 原始陣列 + 一個空字串
      return { ...pre, imagesUrl: newImages };
    });
  };
  // 刪除多圖的圖片
  const handleRemoveImage = () => {
    setTempProduct((prev) => {
      const newImages = [...prev.imagesUrl];
      newImages.pop();
      return { ...prev, imagesUrl: newImages };
    });
  };

  // 新增或修改商品
  const handleModalSubmit = async () => {
    try {
      if (modalMode === "create") {
        await addProduct({ data: tempProduct });
        toast.success("新增成功");
      } else {
        await updateProduct(tempProduct.id, { data: tempProduct });
        toast.success("更新成功");
      }
      closeModal();
      getData();
    } catch (error) {
      toast.error("操作失敗", error);
    }
  };

  return (
    <div className="container p-5">
      <ToastContainer />
      <h1 className="text-white mb-4">產品列表</h1>

      <div className="mb-3 d-flex gap-2">
        <button
          className="btn btn-success"
          onClick={getData}
          style={{ marginRight: "10px" }}
        >
          重整資料
        </button>
        <button
          className="btn btn-warning"
          onClick={checkLogin}
          style={{ marginRight: "10px" }}
        >
          驗證登入狀態
        </button>
        <button
          className="btn btn-primary"
          onClick={() => openModal("create", null)}
        >
          建立新的商品
        </button>
        <button className="btn btn-danger" onClick={handleLogout}>
          登出
        </button>
      </div>

      <div className="table-responsive-lg">
        <table className="table table-hover">
          <thead>
            <tr>
              <th>產品名稱</th>
              <th>原價</th>
              <th>售價</th>
              <th>是否啟用</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {products.map((item) => (
              <tr key={item.id}>
                <td>{item.title}</td>
                <td>{item.origin_price}</td>
                <td>{item.price}</td>
                <td>
                  {item.is_enabled ? (
                    <span className="text-success">啟用</span>
                  ) : (
                    <span className="text-danger">未啟用</span>
                  )}
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-outline-primary me-2"
                    onClick={() => openModal("edit", item)}
                  >
                    編輯
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDelete(item.id)}
                  >
                    刪除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ProductModal
        // 傳到子層
        isOpen={isProductModalOpen}
        onClose={closeModal}
        modalMode={modalMode}
        tempProduct={tempProduct}
        onInputChange={handleModalInputChange}
        onImageChange={handleImageChange}
        onAddImage={handleAddImage}
        onRemoveImage={handleRemoveImage}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
}

export default ProductPage;
