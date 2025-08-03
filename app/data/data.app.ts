// sub aplikasi di sistem
const _data = [
  { id: "BrandDetection", label: "Brand Detection" },
  { id: "BrandHealth", label: "Brand Health" },
  { id: "SyntheticRespondent", label: "Synthetic Respondent" },
  { id: "ECommerceAnalytics", label: "E-Commerce Analytics" },
] as const;

export type TAppId = (typeof _data)[number]["id"];
export type TApp = {
  id: TAppId;
  label: string;
};
export const dataApp: TApp[] = _data as any;
export const getDataApp = (id: TAppId): TApp => {
  return _data.find((i) => i.id == id) ?? ([_data[0]] as any);
};

