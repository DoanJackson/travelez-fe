export const POPULAR_TOURIST_CITIES = {
  HANOI: "thanh_pho_ha_noi",
  HO_CHI_MINH: "thanh_pho_ho_chi_minh",
  DA_NANG: "thanh_pho_da_nang",
  HUE: "tinh_thua_thien_hue",
  NHA_TRANG: "tinh_khanh_hoa",
  DA_LAT: "tinh_lam_dong",
  VUNG_TAU: "tinh_ba_ria_vung_tau",
  PHU_QUOC: "tinh_kien_giang",
  HA_LONG: "tinh_quang_ninh",
  HOI_AN: "tinh_quang_nam",
  SAPA: "tinh_lao_cai",
} as const;

export const CITY_NAME_TO_CODENAME: Record<string, string> = {
  // Miền Bắc
  "Hà Nội": POPULAR_TOURIST_CITIES.HANOI,
  "Ha Noi": POPULAR_TOURIST_CITIES.HANOI,
  "Quảng Ninh": POPULAR_TOURIST_CITIES.HA_LONG,
  "Hạ Long": POPULAR_TOURIST_CITIES.HA_LONG,
  "Lào Cai": POPULAR_TOURIST_CITIES.SAPA,
  "Sapa": POPULAR_TOURIST_CITIES.SAPA,

  // Miền Trung
  "Đà Nẵng": POPULAR_TOURIST_CITIES.DA_NANG,
  "Da Nang": POPULAR_TOURIST_CITIES.DA_NANG,
  "Thừa Thiên Huế": POPULAR_TOURIST_CITIES.HUE,
  "Huế": POPULAR_TOURIST_CITIES.HUE,
  "Khánh Hòa": POPULAR_TOURIST_CITIES.NHA_TRANG,
  "Nha Trang": POPULAR_TOURIST_CITIES.NHA_TRANG,
  "Quảng Nam": POPULAR_TOURIST_CITIES.HOI_AN,
  "Hội An": POPULAR_TOURIST_CITIES.HOI_AN,
  "Lâm Đồng": POPULAR_TOURIST_CITIES.DA_LAT,
  "Đà Lạt": POPULAR_TOURIST_CITIES.DA_LAT,

  // Miền Nam
  "Hồ Chí Minh": POPULAR_TOURIST_CITIES.HO_CHI_MINH,
  "TP HCM": POPULAR_TOURIST_CITIES.HO_CHI_MINH,
  "Ho Chi Minh": POPULAR_TOURIST_CITIES.HO_CHI_MINH,
  "Bà Rịa - Vũng Tàu": POPULAR_TOURIST_CITIES.VUNG_TAU,
  "Vũng Tàu": POPULAR_TOURIST_CITIES.VUNG_TAU,
  "Kiên Giang": POPULAR_TOURIST_CITIES.PHU_QUOC,
  "Phú Quốc": POPULAR_TOURIST_CITIES.PHU_QUOC,
};

/**
 * Hàm hỗ trợ lấy codename chính thức từ tên người dùng nhập hoặc từ Google Maps
 */
export const getCityCodename = (cityName: string): string => {
  return CITY_NAME_TO_CODENAME[cityName] || cityName.toLowerCase().replace(/\s+/g, '_');
};
