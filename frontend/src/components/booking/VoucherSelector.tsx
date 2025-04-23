import React, { useState, useEffect } from "react";
import { getAllVouchers, Voucher } from "@/lib/data_voucher";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface VoucherSelectorProps {
  onSelectVoucher: (voucher: Voucher | null) => void;
  orderTotal: number;
  selectedVoucher: Voucher | null;
}

export const VoucherSelector: React.FC<VoucherSelectorProps> = ({
  onSelectVoucher,
  orderTotal,
  selectedVoucher,
}) => {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [voucherCode, setVoucherCode] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const fetchedVouchers = await getAllVouchers();
        setVouchers(fetchedVouchers);
      } catch (error) {
        console.error("Error fetching vouchers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVouchers();
  }, []);

  const applyCustomVoucher = () => {
    if (!voucherCode.trim()) {
      toast({
        title: "Please enter a voucher code",
        variant: "destructive",
      });
      return;
    }

    const foundVoucher = vouchers.find((v) => v.code === voucherCode);
    if (foundVoucher) {
      onSelectVoucher(foundVoucher);
      toast({
        title: "Voucher applied",
        description: `${foundVoucher.description}`,
      });
    } else {
      toast({
        title: "Invalid voucher code",
        description: "This voucher doesn't exist or has expired",
        variant: "destructive",
      });
    }
  };

  const calculateDiscount = (voucher: Voucher): string => {
    if (voucher.discountType === "Fixed") {
      return `${voucher.discountAmount.toLocaleString()} VND`;
    } else {
      return `${voucher.discountAmount}%`;
    }
  };

  const isEligible = (voucher: Voucher): boolean => {
    // Simple eligibility check - in real app would be more complex
    return voucher.isActive && voucher.usedCount < voucher.maxUsage;
  };

  return (
    <div className="p-6 bg-black/20 rounded-lg">
      <h3 className="text-xl font-medium mb-4">Vouchers</h3>

      {/* Custom voucher input */}
      <div className="flex items-center gap-4 mb-6">
        <input
          type="text"
          value={voucherCode}
          onChange={(e) => setVoucherCode(e.target.value)}
          className="flex-1 p-2 rounded bg-gray-800 text-white"
          placeholder="Enter voucher code"
        />
        <Button onClick={applyCustomVoucher}>Apply</Button>
      </div>

      <Separator className="my-4" />

      {/* Available vouchers list */}
      <div className="mt-4">
        <h4 className="text-md font-medium mb-3">Available Vouchers</h4>

        {loading ? (
          <div className="flex justify-center p-6">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        ) : vouchers.length === 0 ? (
          <p className="text-gray-400 text-center py-4">
            No vouchers available
          </p>
        ) : (
          <ScrollArea className="h-48">
            <div className="space-y-3">
              {vouchers.map((voucher) => (
                <Card
                  key={voucher.id}
                  className={`cursor-pointer transition-colors hover:bg-slate-800/50 ${
                    selectedVoucher?.id === voucher.id
                      ? "border-primary bg-primary/10"
                      : "border-gray-700"
                  }`}
                  onClick={() =>
                    isEligible(voucher) && onSelectVoucher(voucher)
                  }
                >
                  <CardContent className="p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="font-medium text-primary">
                          {voucher.code}
                        </h5>
                        <p className="text-sm text-gray-400">
                          {voucher.description}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Expires:{" "}
                          {new Date(
                            voucher.expirationDate
                          ).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-400">
                          {calculateDiscount(voucher)}
                        </p>
                        {!isEligible(voucher) && (
                          <p className="text-xs text-red-400 mt-1">
                            Not available
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>

      {selectedVoucher && (
        <div className="mt-4 p-3 bg-green-900/20 border border-green-500 rounded-md">
          <p className="text-green-400">
            Selected: {selectedVoucher.code} (
            {calculateDiscount(selectedVoucher)})
          </p>
        </div>
      )}
    </div>
  );
};
