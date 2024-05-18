import axios from "axios";

const HOST = "https://2051050459thao.pythonanywhere.com/"

export const endpoints = {
    "comments" : `/comments/`,
    "hoatdongs": `/hoatdongs/`,
    "hoatdong_detail": (hoadtdongID) => `/hoatdongs/${hoadtdongID}/`,
    "hoatdong_like": (hoatdongID) => `hoatdongs/${hoatdongID}/addlike/`,
    "hoatdong_comment": (hoatdongID) => `hoatdongs/${hoatdongID}/addcomment/`,
    "hoatdong_diemdanh": (hoadtdongID) => `/hoatdongs/${hoadtdongID}/diemdanh/`,
    "hoatdong_diemdanhcsv": (hoadtdongID) => `/hoatdongs/${hoadtdongID}/diemdanhcsv/`,
    "hoatdong_diemdanhtongket": (hoadtdongID) => `/hoatdongs/${hoadtdongID}/diemdanhtongket/`, 
    "hoatdong_dangkyHD": (hoadtdongID) => `/hoatdongs/${hoadtdongID}/sinhviendangky/`,
    "hockis": `/hockis/`,
    "khoas": `/khoas/`,
    "khoas_detail": (khoaID) => `/khoas/${khoaID}/`,
    "likes": `/likes/`,
    "lops": `/lops/`,
    "minhchungs": `/minhchungs/`,
    "minhchungs_detail": (minhchungID) => `/minhchungs/${minhchungID}/`,
    "quyches": `/quyches/`,
    "tags": `/tags/`,
    "thanhtichs": `/thanhtichs/`,
    "thanhtichs_statpdf": `/thanhtichs/statspdf/`,
    "thanhtichs_statpdftlsv": `/thanhtichs/statspdftlsv/`,
    "thanhtichs_statcsv": `/thanhtichs/statscsv/`, 
    "thanhtichs_statcsvtlsv": `/thanhtichs/statscsvtlsv/`,
    "thanhtichs_thongke": `/thanhtichs/thongke/`,
    "thanhtichs_thongketlsv": `/thanhtichs/thongketlsv/`,
    "users": `/users/`,
    "user_ctsv": `/users/ctsv/`,
    "user_current": `/users/current/`,
    "user_tlsv": `/users/tlsv/`,
    "usersvs": `/usersvs/`,
    "usersvs_detail": (userID) => `/usersvs/${userID}/`,
    "usersvs_detail_hoatdong": (userID) => `/usersvs/${userID}/hoat_dongs/`,
    "usersvs_detail_thanhtichs": (userID) => `/usersvs/${userID}/thanh_tichs/`,
    "login" : "/o/token/"
}

export const authApi = (accessToken) => axios.create({
    baseURL: HOST,
    headers: {
        "Authorization": `Bearer ${accessToken}`
    }
})

export const apiLogin = () => axios.create ({
    baseURL: HOST,
    headers: {
        'Content-Type': 'multipart/form-data',
      },
})

export default axios.create({
    baseURL: HOST
})