"use client";

import { useEffect, useState } from "react";
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import { toast } from "sonner"

export default function CouponsPage() {
  const [code, setCode] = useState("");
  const [discountValue, setDiscountValue] = useState<number>(0);
  const [expiryDate, setExpiryDate] = useState("");
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch all coupons
  async function fetchCoupons() {
    const res = await fetch("/api/admin/coupons");
    const data = await res.json();
    if (data.success) setCoupons(data.coupons);
  }

  useEffect(() => {
    fetchCoupons();
  }, []);

  // Create coupon
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const res = await fetch("/api/admin/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, discountValue, expiryDate }),
    });

    const data = await res.json();
    if (data.success) {
      toast.success("Coupon created successfully")
      setCode("");
      setDiscountValue(0);
      setExpiryDate("");
      fetchCoupons();
    } else {
      setMessage("❌ " + data.message);
    }
    setLoading(false);
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Admin - Manage Coupons</h1>

      {/* Coupon Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6 mb-8"
      >
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="block mb-1 font-medium">Coupon Code</label>
            <Input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="SAVE10"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Discount %</label>
            <Input
              type="number"
            //   value={discountValue}
              onChange={(e) => setDiscountValue(Number(e.target.value))}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="10"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Expiry Date</label>
            <Input
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
              required
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="mt-4  px-4 py-2 rounded-lg"
        >
          {loading ? "Creating..." : "Create Coupon"}
        </Button>

        {message && <p className="mt-3 text-sm">{message}</p>}
      </form>

      {/* Coupons Table */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">All Coupons</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="border p-2">Code</th>
              <th className="border p-2">Discount</th>
              <th className="border p-2">Expiry Date</th>
              <th className="border p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {coupons.length > 0 ? (
              coupons.map((coupon) => (
                <tr key={coupon._id}>
                  <td className="border p-2 font-mono">{coupon.code}</td>
                  <td className="border p-2">{coupon.discountValue}%</td>
                  <td className="border p-2">
                    {new Date(coupon.expiryDate).toLocaleDateString()}
                  </td>
                  <td className="border p-2">
                    {new Date(coupon.expiryDate) < new Date()
                      ? "Expired"
                      : "Active"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="p-4 text-center text-gray-500" colSpan={4}>
                  No coupons found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
