// import { Routes, Route } from "react-router-dom";
// import LoginPage from "./pages/LoginPage";
// import { useState, useEffect } from "react";
// import {
//   adminSignin,
//   getAdminProducts,
//   checkUserLogin,
//   deleteProduct,
//   addProduct,
//   updateProduct,
// } from "./api/Api";
// import * as bootstrap from "bootstrap";

// function App() {
//   // 新增商品格式
//   const addNewProduct = {
//     title: "",
//     category: "",
//     origin_price: 0,
//     price: 0,
//     unit: "",
//     description: "",
//     content: "",
//     is_enabled: 1,
//     imageUrl: "",
//     imagesUrl: [],
//   };

//   const [isAuth, setIsAuth] = useState(false);
//   const [products, setProducts] = useState([]);
//   const [tempNewProduct, setTempNewProduct] = useState(addNewProduct);
//   const [modalMode, setModalMode] = useState(null);

//   // 登入
//   const testLogin = async () => {
//     try {
//       const res = await adminSignin({
//         username: "angel6160@gmail.com",
//         password: "OK86616013!",
//       });
//       console.log("登入成功:", res.data);
//       const { token, expired } = res.data;
//       document.cookie = `hexToken=${token};expires=${new Date(expired)};`;
//       setIsAuth(true);
//       getData();
//     } catch (error) {
//       console.error("登入失敗", error);
//     }
//   };

//   // 檢查登入狀態
//   const checkLogin = async () => {
//     try {
//       const res = await checkUserLogin();
//       console.log("登入成功", res.data);
//       setIsAuth(true);
//       getData();
//     } catch (error) {
//       console.error("檢查失敗，請確認是否登入", error);
//       setIsAuth(false);
//     }
//   };
//   useEffect(() => {
//     const token = document.cookie.replace(
//       /(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/,
//       "$1"
//     );
//     if (token) {
//       checkLogin();
//     }
//   }, []);

//   // 取得商品
//   const getData = async () => {
//     try {
//       const res = await getAdminProducts();
//       console.log("產品資料:", res.data);
//       setProducts(Object.values(res.data.products));
//     } catch (error) {
//       console.error("抓資料失敗", error);
//     }
//   };

//   // 刪除商品
//   const handleDelete = async (id) => {
//     try {
//       const res = await deleteProduct(id);
//       console.log(`商品：${id}刪除成功!`, res.data);
//       getData();
//     } catch (error) {
//       console.error(`商品：${id}刪除失敗!`, error);
//     }
//   };

//   // 新增商品 (先抓 input 資料再新增)
//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     let finalValue = value;
//     // 把字串轉成數字
//     if (["price", "origin_price"].includes(name)) {
//       finalValue = Number(value);
//     } else if (name === "is_enabled") {
//       finalValue = Number(value); // 將 "1" 或 "0" 轉為數字
//     }

//     setTempNewProduct((pre) => ({
//       ...pre,
//       [name]: finalValue,
//     }));
//   };

//   const handleAdd = async () => {
//     try {
//       const res = await addProduct({
//         data: tempNewProduct,
//       });
//       console.log(tempNewProduct);
//       console.log(`商品新增成功!`, res.data);
//       setTempNewProduct(addNewProduct);
//       getData();
//       closeModal();
//     } catch (error) {
//       console.error(`商品新增失敗!`, error);
//       console.log(tempNewProduct);
//     }
//   };

//   // 多張圖片
//   const handleImageChange = (index, value) => {
//     setTempNewProduct((pre) => {
//       const newImages = [...pre.imagesUrl]; // 複製新的陣列
//       newImages[index] = value; // 修改指定位置的值
//       return { ...pre, imagesUrl: newImages }; // 更新回去
//     });
//   };
//   // 新增多圖的圖片
//   const handleAddImage = () => {
//     setTempNewProduct((pre) => {
//       const newImages = [...pre.imagesUrl, ""]; // 原始陣列 + 一個空字串
//       return { ...pre, imagesUrl: newImages };
//     });
//   };
//   // 刪除多圖的圖片
//   const handleRemoveImage = () => {
//     setTempNewProduct((prev) => {
//       const newImages = [...prev.imagesUrl];
//       newImages.pop();
//       return { ...prev, imagesUrl: newImages };
//     });
//   };

//   // 編輯商品
//   const handleUpdate = async () => {
//     try {
//       const res = await updateProduct(tempNewProduct.id, {
//         data: tempNewProduct,
//       });
//       console.log(`商品修改成功!`, res.data);
//       getData();
//       closeModal();
//     } catch (error) {
//       console.error(`商品修改失敗!`, error);
//       console.log(tempNewProduct);
//     }
//   };

//   // 打開 Modal
//   const openModal = (mode, product) => {
//     setModalMode(mode);

//     if (mode === "create") {
//       // 新增 -> 把暫存資料清空 (回復成預設值)
//       setTempNewProduct(addNewProduct);
//     } else if (mode === "edit") {
//       // 編輯 -> 把該商品的資料「帶入」暫存 state
//       setTempNewProduct({
//         ...product,
//         imagesUrl: product.imagesUrl || [],
//         // 確保 imagesUrl 永遠是陣列
//       });
//     }

//     const modal = new bootstrap.Modal(document.getElementById("productModal"));
//     modal.show();
//   };
//   // 關閉 Modal
//   const closeModal = () => {
//     const modalElement = document.getElementById("productModal");
//     const modal = bootstrap.Modal.getInstance(modalElement);
//     if (modal) modal.hide();
//   };

//   return (
//     <div style={{ padding: "20px" }}>
//       <h1>開發測試模式</h1>

//       <p>目前狀態: {isAuth ? "已登入" : "未登入"}</p>

//       <div style={{ marginBottom: "20px" }}>
//         <button onClick={testLogin} style={{ marginRight: "10px" }}>
//           測試登入
//         </button>
//         <button onClick={getData} style={{ marginRight: "10px" }}>
//           手動抓資料
//         </button>
//         <button onClick={checkLogin} style={{ marginRight: "10px" }}>
//           測試登入狀態
//         </button>
//       </div>
//       <div style={{ marginBottom: "20px" }}>
//         {/* <button onClick={} style={{ marginRight: "10px" }}>
//           新增
//         </button>
//         <button onClick={} style={{ marginRight: "10px" }}>
//           編輯
//         </button> */}
//         <button onClick={() => handleDelete(products[0]?.id)}>
//           刪除第一筆商品(測試)
//         </button>
//       </div>
//       <button
//         type="button"
//         className="btn btn-primary"
//         onClick={() => openModal("create", null)}
//       >
//         建立新的商品
//       </button>
//       <hr />

//       <button
//         type="button"
//         className="btn btn-primary"
//         onClick={modalMode === "create" ? handleAdd : handleUpdate}
//       >
//         {modalMode === "create" ? "確認新增" : "確認修改"}
//       </button>
//       <hr />
//       {/* Modal 區塊 (把原本的表單包在裡面) */}
//       <div className="modal fade" id="productModal" tabIndex="-1">
//         <div className="modal-dialog modal-xl">
//           <div className="modal-content">
//             <div className="modal-header">
//               {/* 標題根據模式改變 */}
//               <h5 className="modal-title">
//                 {modalMode === "create" ? "新增產品" : "編輯產品"}
//               </h5>
//               <button
//                 type="button"
//                 className="btn-close"
//                 data-bs-dismiss="modal"
//               ></button>
//             </div>
//             <div className="modal-body">
//               {/* 這裡放你原本那一長串的 <div className="row">... inputs ...</div> */}
//               {/* 因為 input 的 value 綁定了 tempProduct，所以 openModal 設定完 state 後，這裡就會顯示資料 */}
//               <form>
//                 <div className="row text-start">
//                   {/* 商品標題 */}
//                   <div className="col-12">
//                     <div className="mb-3">
//                       <label htmlFor="title" className="form-label">
//                         商品標題
//                       </label>
//                       <input
//                         type="text"
//                         className="form-control"
//                         id="title"
//                         name="title"
//                         value={tempNewProduct.title}
//                         onChange={handleInputChange}
//                         placeholder="請輸入商品標題"
//                       />
//                     </div>
//                   </div>
//                   {/* 商品描述 */}
//                   <div className="col-6">
//                     <div className="mb-3">
//                       <label htmlFor="content" className="form-label">
//                         商品描述
//                       </label>
//                       <input
//                         type="text"
//                         className="form-control"
//                         id="content"
//                         name="content"
//                         value={tempNewProduct.content}
//                         onChange={handleInputChange}
//                         placeholder="請輸入商品描述"
//                       />
//                     </div>
//                   </div>
//                   {/* 商品說明 */}
//                   <div className="col-6">
//                     <div className="mb-3">
//                       <label htmlFor="description" className="form-label">
//                         商品說明
//                       </label>
//                       <input
//                         type="text"
//                         className="form-control"
//                         id="description"
//                         name="description"
//                         value={tempNewProduct.description}
//                         onChange={handleInputChange}
//                         placeholder="請輸入商品說明"
//                       />
//                     </div>
//                   </div>
//                   {/* 商品原價 */}
//                   <div className="col-3">
//                     <div className="mb-3">
//                       <label htmlFor="origin_price" className="form-label">
//                         商品原價
//                       </label>
//                       <input
//                         type="number"
//                         className="form-control"
//                         id="origin_price"
//                         name="origin_price"
//                         value={tempNewProduct.origin_price}
//                         onChange={handleInputChange}
//                         placeholder="請輸入商品原價"
//                         min="0"
//                       />
//                     </div>
//                   </div>
//                   {/* 商品售價 */}
//                   <div className="col-3">
//                     <div className="mb-3">
//                       <label htmlFor="price" className="form-label">
//                         商品售價
//                       </label>
//                       <input
//                         type="number"
//                         className="form-control"
//                         id="price"
//                         name="price"
//                         value={tempNewProduct.price}
//                         onChange={handleInputChange}
//                         placeholder="請輸入商品售價"
//                         min="0"
//                       />
//                     </div>
//                   </div>
//                   {/* 商品單位 */}
//                   <div className="col-3">
//                     <div className="mb-3">
//                       <label htmlFor="unit" className="form-label">
//                         商品單位
//                       </label>
//                       <input
//                         type="text"
//                         className="form-control"
//                         id="unit"
//                         name="unit"
//                         value={tempNewProduct.unit}
//                         onChange={handleInputChange}
//                         placeholder="例如：塊"
//                       />
//                     </div>
//                   </div>
//                   {/* 商品分類 */}
//                   <div className="col-3">
//                     <div className="mb-3">
//                       <label htmlFor="category" className="form-label">
//                         商品分類
//                       </label>
//                       <input
//                         type="text"
//                         className="form-control"
//                         id="category"
//                         name="category"
//                         value={tempNewProduct.category}
//                         onChange={handleInputChange}
//                         placeholder="請輸入商品分類"
//                       />
//                     </div>
//                   </div>
//                   {/* 商品主圖 */}
//                   <div className="col-12">
//                     <div className="mb-3">
//                       <label htmlFor="imageUrl" className="form-label">
//                         商品主圖片網址
//                       </label>
//                       <input
//                         type="url"
//                         className="form-control"
//                         id="imageUrl"
//                         name="imageUrl"
//                         value={tempNewProduct.imageUrl}
//                         onChange={handleInputChange}
//                         placeholder="請輸入圖片網址"
//                       />
//                       {/* 預覽圖片 */}
//                       {tempNewProduct.imageUrl && (
//                         <img
//                           src={tempNewProduct.imageUrl}
//                           alt="preview"
//                           className="img-fluid mt-2"
//                           style={{ height: "100px" }}
//                         />
//                       )}
//                     </div>
//                   </div>
//                   {/* 商品副圖 */}
//                   <div className="col-12">
//                     <div className="mb-3">
//                       <p className="mb-2">多圖設定 (副圖)</p>
//                       {tempNewProduct.imagesUrl?.map((url, index) => (
//                         <div key={index} className="mb-3">
//                           <label className="form-label">
//                             圖片網址 {index + 1}
//                           </label>
//                           <input
//                             type="url"
//                             className="form-control mb-2"
//                             placeholder={`請輸入副圖 ${index + 1} 網址`}
//                             value={url}
//                             // 注意：這裡不能用 handleInputChange，要用我們剛寫的 handleImageChange
//                             onChange={(e) =>
//                               handleImageChange(index, e.target.value)
//                             }
//                           />
//                           {/* 預覽圖 */}
//                           {url && (
//                             <img
//                               src={url}
//                               alt={`副圖 ${index + 1}`}
//                               className="img-fluid rounded mb-2"
//                               style={{ height: "100px", objectFit: "cover" }}
//                             />
//                           )}
//                         </div>
//                       ))}
//                       {/* 多圖新增 + 刪除 */}
//                       <div className="btn-group w-100">
//                         {/* 如果陣列為空或最後一格有寫東西 -> 才能新增下一張 */}
//                         {tempNewProduct.imagesUrl?.length < 5 &&
//                           tempNewProduct.imagesUrl[
//                             tempNewProduct.imagesUrl.length - 1
//                           ] !== "" && (
//                             <button
//                               type="button"
//                               className="btn btn-outline-primary btn-sm"
//                               onClick={handleAddImage}
//                             >
//                               新增圖片
//                             </button>
//                           )}

//                         {/* 如果有圖片才顯示刪除按鈕 */}
//                         {tempNewProduct.imagesUrl?.length > 0 && (
//                           <button
//                             type="button"
//                             className="btn btn-outline-danger btn-sm"
//                             onClick={handleRemoveImage}
//                           >
//                             刪除最後一張
//                           </button>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                   {/* 商品是否啟用 */}
//                   <div>
//                     <p className="mb-2">是否啟用</p>
//                     <div className="form-check">
//                       <input
//                         className="form-check-input"
//                         type="radio"
//                         name="is_enabled"
//                         id="is_enabled"
//                         value="1"
//                         checked={tempNewProduct.is_enabled === 1}
//                         onChange={handleInputChange}
//                       />
//                       <label className="form-check-label" htmlFor="is_enabled">
//                         啟用
//                       </label>
//                     </div>
//                     <div className="form-check">
//                       <input
//                         className="form-check-input"
//                         type="radio"
//                         name="is_enabled"
//                         id="is_unabled"
//                         value="0"
//                         checked={tempNewProduct.is_enabled === 0}
//                         onChange={handleInputChange}
//                       />
//                       <label className="form-check-label" htmlFor="is_unabled">
//                         未啟用
//                       </label>
//                     </div>
//                   </div>
//                 </div>
//               </form>
//             </div>
//             <div className="modal-footer">
//               <button
//                 type="button"
//                 className="btn btn-secondary"
//                 data-bs-dismiss="modal"
//               >
//                 取消
//               </button>

//               {/* 送出按鈕：根據模式決定呼叫哪個函式 */}
//               <button
//                 type="button"
//                 className="btn btn-primary"
//                 onClick={modalMode === "create" ? handleAdd : handleUpdate}
//               >
//                 {modalMode === "create" ? "確認新增" : "確認修改"}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       <h3>資料檢查區 (Raw Data)</h3>
//       <pre style={{ background: "#eee", padding: "10px" }}>
//         {JSON.stringify(products, null, 2)}
//       </pre>
//     </div>
//   );
// }

// export default App;
import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ProductPage from "./pages/ProductPage";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/products" element={<ProductPage />} />
      </Routes>
    </div>
  );
}

export default App;
