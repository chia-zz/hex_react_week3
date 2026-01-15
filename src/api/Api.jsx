import axios from "axios";

const apiBase = import.meta.env.VITE_API_BASE;
const apiPath = import.meta.env.VITE_API_PATH;

// 存 token
const getHeaders = () => {
  const token = document.cookie.replace(
    /(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/,
    "$1"
  );
  // axios headers
  return {
    headers: { Authorization: token },
  };
};

export { apiBase, apiPath };

// 登入
export const adminSignin = (data) => {
  // data { username: "", password: "" }
  return axios.post(`${apiBase}/admin/signin`, data);
};

// 檢查登入
export const checkUserLogin = () => {
  return axios.post(`${apiBase}/api/user/check`, {}, getHeaders());
};

// 登出
export const adminLogout = () => {
  return axios.post(`${apiBase}/logout`, {}, getHeaders());
};

// 取得商品資料
export const getAdminProducts = () => {
  return axios.get(
    `${apiBase}/api/${apiPath}/admin/products/all`,
    getHeaders()
  );
};

// 新增商品
export const addProduct = (data) => {
  return axios.post(
    `${apiBase}/api/${apiPath}/admin/product`,
    data,
    getHeaders()
  );
};

// 編輯商品
export const updateProduct = (id, data) => {
  return axios.put(
    `${apiBase}/api/${apiPath}/admin/product/${id}`,
    data,
    getHeaders()
  );
};

// 刪除商品
export const deleteProduct = (id) => {
  return axios.delete(
    `${apiBase}/api/${apiPath}/admin/product/${id}`,
    getHeaders()
  );
};
