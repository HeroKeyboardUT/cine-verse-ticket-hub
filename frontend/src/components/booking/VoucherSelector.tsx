import React, { useState } from "react";
import { Voucher } from "@/lib/data_voucher";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Tag, Calendar, Gift, Check, Percent } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

interface VoucherSelectorProps {
  onSelectVoucher: (voucher: Voucher | null) => void;
  orderTotal: number;
  selectedVoucher: Voucher | null;
  vouchers: Voucher[];
  isLoading?: boolean;
}

export const VoucherSelector: React.FC<VoucherSelectorProps> = ({
  onSelectVoucher,
  orderTotal,
  selectedVoucher,
  vouchers = [],
  isLoading = false,
}) => {
  const [voucherCode, setVoucherCode] = useState("");
  const { toast } = useToast();

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

  const calculateSavings = (voucher: Voucher): string => {
    let savings = 0;
    if (voucher.discountType === "Fixed") {
      savings = voucher.discountAmount;
    } else {
      savings = (orderTotal * voucher.discountAmount) / 100;
    }
    return `${savings.toLocaleString()} VND`;
  };

  const isEligible = (voucher: Voucher): boolean => {
    // Simple eligibility check - in real app would be more complex
    return voucher.isActive && voucher.usedCount < voucher.maxUsage;
  };

  const formatDate = (dateString: string): string => {
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch (error) {
      return dateString;
    }
  };

  const getUsageInfo = (voucher: Voucher): string => {
    return `${voucher.usedCount}/${voucher.maxUsage} used`;
  };

  return (
    <div className="p-6 bg-black/20 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-medium">Vouchers</h3>
        {selectedVoucher && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSelectVoucher(null)}
          >
            Clear Selection
          </Button>
        )}
      </div>

      {/* Custom voucher input */}
      <div className="flex items-center gap-4 mb-6">
        <input
          type="text"
          value={voucherCode}
          onChange={(e) => setVoucherCode(e.target.value)}
          className="flex-1 p-3 rounded bg-gray-800 text-white border border-gray-700 focus:border-primary focus:ring-1 focus:ring-primary"
          placeholder="Enter voucher code"
        />
        <Button onClick={applyCustomVoucher}>Apply</Button>
      </div>

      <Separator className="my-4" />

      {/* Selected voucher display */}
      {selectedVoucher && (
        <div className="mb-6 p-4 bg-green-900/20 border border-green-500 rounded-lg">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-green-400" />
                <span className="font-medium text-green-400">
                  Applied Voucher
                </span>
              </div>
              <h4 className="text-lg font-bold text-white mt-1">
                {selectedVoucher.code}
              </h4>
              <p className="text-sm text-gray-300 mt-1">
                {selectedVoucher.description}
              </p>
            </div>
            <div className="text-right">
              <Badge className="bg-green-600 hover:bg-green-700">
                {calculateDiscount(selectedVoucher)}
              </Badge>
              <p className="text-xs text-gray-400 mt-1">
                Expires: {formatDate(selectedVoucher.expirationDate)}
              </p>
            </div>
          </div>
          <div className="mt-2 text-sm text-green-400">
            You save: {calculateSavings(selectedVoucher)}
          </div>
        </div>
      )}

      {/* Available vouchers list */}
      <div className="mt-4">
        <h4 className="text-md font-medium mb-3">Available Vouchers</h4>

        {isLoading ? (
          <div className="flex justify-center p-6">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        ) : vouchers.length === 0 ? (
          <p className="text-gray-400 text-center py-4">
            No vouchers available
          </p>
        ) : (
          <ScrollArea className="h-64">
            <div className="space-y-3 pr-4">
              {vouchers.map((voucher) => (
                <Card
                  key={voucher.id}
                  className={`cursor-pointer transition-colors hover:bg-slate-800/50 ${
                    selectedVoucher?.id === voucher.id
                      ? "border-primary bg-primary/10"
                      : "border-gray-700"
                  } ${!isEligible(voucher) ? "opacity-60" : ""}`}
                  onClick={() =>
                    isEligible(voucher) &&
                    (selectedVoucher?.id === voucher.id
                      ? onSelectVoucher(null)
                      : onSelectVoucher(voucher))
                  }
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          {voucher.discountType === "Fixed" ? (
                            <Gift className="h-4 w-4 text-primary" />
                          ) : (
                            <Percent className="h-4 w-4 text-primary" />
                          )}
                          <h5 className="font-medium text-primary">
                            {voucher.code}
                          </h5>
                        </div>
                        <p className="text-sm text-gray-300 mb-1">
                          {voucher.description}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-gray-400 mt-2">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>
                            Valid until: {formatDate(voucher.expirationDate)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                          <Tag className="h-3.5 w-3.5" />
                          <span>{getUsageInfo(voucher)}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge
                          className={`${
                            voucher.discountType === "Fixed"
                              ? "bg-blue-600 hover:bg-blue-700"
                              : "bg-amber-600 hover:bg-amber-700"
                          }`}
                        >
                          {calculateDiscount(voucher)}
                        </Badge>
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
    </div>
  );
};
