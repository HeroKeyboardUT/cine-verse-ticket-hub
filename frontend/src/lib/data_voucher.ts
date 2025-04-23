import API_VOUCHER from "./API_lib/API_VOUCHER";

export interface Voucher {
  id: string;
  code: string;
  description: string;
  discountAmount: number;
  discountType: "Percentage" | "Fixed";
  issueDate: string;
  expirationDate: string;
  maxUsage: number;
  usedCount: number;
  isActive: boolean;
}

export const getVoucherByCode = async (
  code: string
): Promise<Voucher | null> => {
  try {
    const response = await fetch(`${API_VOUCHER.GET_VOUCHER_BY_CODE}/${code}`);

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch voucher: ${response.status}`);
    }

    const data = await response.json();
    return mapVoucherFromApi(data);
  } catch (error) {
    console.error("Error fetching voucher:", error);
    return null;
  }
};

export const getAllVouchers = async (): Promise<Voucher[]> => {
  try {
    const response = await fetch(API_VOUCHER.GET_ALL_VOUCHERS);

    if (!response.ok) {
      throw new Error(`Failed to fetch vouchers: ${response.status}`);
    }

    const data = await response.json();
    return data.map(mapVoucherFromApi);
  } catch (error) {
    console.error("Error fetching vouchers:", error);
    return [];
  }
};

const mapVoucherFromApi = (data: any): Voucher => ({
  id: data.VoucherID,
  code: data.Code,
  description: data.Description,
  discountAmount: data.DiscountAmount,
  discountType: data.DiscountType,
  issueDate: data.IssueDate,
  expirationDate: data.ExpirationDate,
  maxUsage: data.MaxUsage,
  usedCount: data.UsedCount,
  isActive: data.IsActive,
});
