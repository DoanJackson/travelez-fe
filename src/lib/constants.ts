export const HCMC_PLACE_ID = 28;

// poiType values from the real API (confirmed from Swagger)
export const ATTRACTION_POI_TYPES = [
  "ATTRACTION",
  "NATURE",
  "RELIGIOUS",
  "NIGHTLIFE",
] as const;

export const DINING_POI_TYPES = [
  "CAFE_DESSERT",
  "STREET_FOOD",
  "RESTAURANT",
] as const;

export const SHOPPING_POI_TYPES = ["SHOPPING", "OTHER"] as const;
