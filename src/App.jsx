import { useState } from "react";
import axios from "axios";
import { ToastContainer, toast, Bounce } from "react-toastify";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "react-toastify/dist/ReactToastify.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import * as bootstrap from "bootstrap";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function App() {
  // state 區
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [isAuth, setIsAuth] = useState(false);
  const [tempProduct, setTempProduct] = useState(null);
  const [products, setProducts] = useState([]);

  // 其他設定
  const toastSetting = {
    position: "top-right",
    autoClose: 3000,
    theme: "dark",
    transition: Bounce,
  };

  // 登入頁面
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((preData) => ({
      ...preData,
      [name]: value,
    }));
  };

  // API 區
  // 產品列表
  const getProductData = async (e) => {
    if (e) e.preventDefault();
    try {
      const response = await axios.get(
        `${API_BASE}/api/${API_PATH}/admin/products/all`
      );
      console.log(response.data.products);
      setProducts(Object.values(response.data.products));
    } catch (error) {
      console.log(error.response?.data.message);
    }
  };
  // 檢查權限
  // 登入
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE}/admin/signin`, formData);
      // console.log(response.data);
      const { token, expired } = response.data;

      // cookie & token setting
      document.cookie = `loginToken=${token};expires=${new Date(expired)};`;
      axios.defaults.headers.common["Authorization"] = token;

      getProductData();
      toast.success(`登入成功！`, toastSetting);
      setIsAuth(true);
    } catch (error) {
      toast.error(`登入失敗: ${error.response?.data.message}`);
      setIsAuth(false);
    }
  };
  // 檢查登入狀態
  const checkLogin = async (e) => {
    if (e) e.preventDefault();
    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("loginToken="))
        ?.split("=")[1];
      axios.defaults.headers.common["Authorization"] = token;
      const response = await axios.post(`${API_BASE}/api/user/check`);
      console.log(response.data);
      setIsAuth(true);
      getProductData();
      toast.success(`驗證成功！`, toastSetting);
    } catch (error) {
      console.log(error.response?.data.message);
      toast.error("驗證失敗，請重新登入");
      setIsAuth(false);
    }
  };
  // 登出
  const logout = async (e) => {
    if (e) e.preventDefault();
    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("loginToken="))
        ?.split("=")[1];
      axios.defaults.headers.common["Authorization"] = token;
      const response = await axios.post(`${API_BASE}/logout`);
      console.log(response.data);
      // 登出時清除 token
      axios.defaults.headers.common["Authorization"] = "";
      setIsAuth(false);
      setProducts([]);
      setTempProduct(null);
      toast.success(`登出成功！`, toastSetting);
    } catch (error) {
      console.log(error.response?.data.message);
      toast.error("登出發生錯誤，但已清除登入狀態");
      setIsAuth(false);
      setProducts([]);
    }
  };

  const modalDetail = (product) => {
    setTempProduct(product);
    const modal = new bootstrap.Modal(document.getElementById("productDetail"));
    modal.show();
  };

  return (
    <>
      <ToastContainer />
      {!isAuth ? (
        <div className="container login">
          <h2>請先登入</h2>
          <form className="form-floating">
            <div className="form-floating mb-3">
              <input
                type="email"
                className="form-control"
                name="username"
                id="username"
                placeholder="name@gmail.com"
                value={formData.username}
                onChange={(e) => handleInputChange(e)}
              />
              <label htmlFor="username">Email Address</label>
            </div>
            <div className="form-floating mb-3">
              <input
                type="password"
                className="form-control"
                name="password"
                id="password"
                placeholder="12345678"
                value={formData.password}
                onChange={(e) => handleInputChange(e)}
              />
              <label htmlFor="password">Password</label>
            </div>
            <button
              type="submit"
              className="btn btn-primary w-100 mt-2"
              onClick={handleSubmit}
              disabled={!formData.username || !formData.password}
            >
              {formData.username && formData.password
                ? "登入"
                : "請輸入帳號密碼"}
            </button>
          </form>
        </div>
      ) : (
        <div>
          <div className="d-flex justify-content-center mx-auto mt-3 p-2 gap-3 ">
            <button
              type="submit"
              className="btn btn-danger"
              onClick={checkLogin}
            >
              確認登入狀態
            </button>
            <button type="submit" className="btn btn-warning" onClick={logout}>
              登出
            </button>
          </div>

          <div className="container mb-3">
            <div className="row my-2 mx-md-5">
              <div className="col">
                <h2 className="list-title my-3">產品列表</h2>
                <div className="table-responsive-lg">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th scope="col">產品名稱</th>
                        <th scope="col">原價</th>
                        <th scope="col">售價</th>
                        <th scope="col">是否啟用</th>
                        <th scope="col">細節</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((item) => (
                        <tr key={item.id}>
                          <th scope="row">{item.title}</th>
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
                              type="button"
                              className="btn btn-sm btn-dark"
                              onClick={() => modalDetail(item)}
                            >
                              查看
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="modal fade" id="productDetail" tabIndex="-1">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header bg-dark">
                      <h5 className="modal-title text-light">產品明細</h5>
                      <button
                        type="button"
                        className="btn-close btn-close-white"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      ></button>
                    </div>
                    <div className="modal-body">
                      {tempProduct ? (
                        <>
                          <img
                            src={tempProduct.imageUrl}
                            className="img-fluid mb-3 rounded-3"
                            style={{
                              width: "300px",
                              height: "300px",
                              objectFit: "cover",
                            }}
                            alt={tempProduct.title}
                          />
                          <h6 className="fs-2 fw-bold">
                            {tempProduct.title}
                            <span className="fs-6 badge bg-dark ms-2 fw-medium">
                              {tempProduct.category}
                            </span>
                          </h6>
                          <p>產品{tempProduct.content}</p>
                          <p>產品描述:{tempProduct.description}</p>
                          <p>
                            產品售價:
                            <del className="mx-1 text-muted">
                              {tempProduct.origin_price}
                            </del>
                            /
                            <span className="fw-bold mx-1 text-success">
                              {tempProduct.price}
                            </span>
                          </p>

                          <div className="imagesUrl">
                            {/* 防止報錯 */}
                            {tempProduct.imagesUrl?.length > 0 ? (
                              <Swiper
                                className="custom-swiper"
                                modules={[Navigation, Pagination]}
                                spaceBetween={12}
                                slidesPerView={3}
                                navigation
                                pagination={{ clickable: true }}
                                style={{
                                  paddingBottom: "40px",
                                  paddingLeft: "50px",
                                  paddingRight: "50px",
                                }}
                                onSlideChange={() =>
                                  console.log("slide change")
                                }
                                onSwiper={(swiper) => console.log(swiper)}
                              >
                                {tempProduct.imagesUrl.map((url, index) => (
                                  <SwiperSlide key={index} src={url}>
                                    <img
                                      key={index}
                                      src={url}
                                      className="rounded-3"
                                      style={{
                                        width: "100%",
                                        height: "120px",
                                        objectFit: "cover",
                                      }}
                                      alt={`${index + 1}`}
                                    />
                                  </SwiperSlide>
                                ))}
                              </Swiper>
                            ) : (
                              <p className="text-muted">無其他圖片</p>
                            )}
                          </div>
                        </>
                      ) : (
                        <p className="text-secondary">請選擇一個產品查看細節</p>
                      )}
                    </div>
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        data-bs-dismiss="modal"
                      >
                        關閉
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
