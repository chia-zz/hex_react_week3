import { useEffect, useRef } from "react";
import * as bootstrap from "bootstrap";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

function DetailModal({ tempProduct, isOpen, onClose }) {
  const modalRef = useRef(null);
  const bsModalRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      bsModalRef.current = new bootstrap.Modal(modalRef.current);
      bsModalRef.current.show();
    } else if (bsModalRef.current) {
      bsModalRef.current.hide();
    }
  }, [isOpen]);
  useEffect(() => {
    // 建立 Modal 實體
    const modalElement = modalRef.current;
    const modalInstance = new bootstrap.Modal(modalElement, {
      backdrop: true, // 允許點擊背景關閉
      keyboard: true, // 允許按 Esc 關閉
    });

    bsModalRef.current = modalInstance;

    // 顯示或隱藏
    if (isOpen) {
      modalInstance.show();
    } else {
      modalInstance.hide();
    }

    // --------------------------------------------------
    // ⭐ 關鍵修正：監聽 Bootstrap 的「關閉完成」事件
    // 當使用者點擊背景關閉 Modal 時，這裡會被觸發
    // --------------------------------------------------
    const performClose = () => {
      if (isOpen) {
        onClose(); // 呼叫父層的關閉函式，把 React State 設回 false
      }
    };

    modalElement.addEventListener("hidden.bs.modal", performClose);

    // 清除函式 (Component 卸載時執行)
    return () => {
      modalElement.removeEventListener("hidden.bs.modal", performClose);
      modalInstance.dispose(); // 銷毀實體，避免殘留
    };
  }, [isOpen, onClose]);

  const handleClose = () => {
    onClose();
  };

  return (
    <div className="modal fade" ref={modalRef} tabIndex="-1">
      <div className="modal-dialog modal-xl">
        <div className="modal-content">
          <div className="modal-header bg-dark">
            <h5 className="modal-title text-light">產品明細</h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={handleClose}
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
                <p>產品內容：{tempProduct.content}</p>
                <p>產品描述：{tempProduct.description}</p>
                <p>
                  產品售價：
                  <del className="mx-1 text-muted">
                    {tempProduct.origin_price}
                  </del>
                  /
                  <span className="fw-bold mx-1 text-success">
                    {tempProduct.price}
                  </span>
                </p>

                <div className="imagesUrl">
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
                    >
                      {tempProduct.imagesUrl.map((url, index) => (
                        <SwiperSlide key={index}>
                          <img
                            src={url}
                            className="rounded-3"
                            style={{
                              width: "100%",
                              height: "120px",
                              objectFit: "cover",
                            }}
                            alt={`副圖 ${index + 1}`}
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
              onClick={handleClose}
            >
              關閉
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailModal;
