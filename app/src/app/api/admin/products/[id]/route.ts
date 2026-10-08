import { NextRequest, NextResponse } from "next/server";
import { MOCK_PRODUCTS } from "@/mock/products";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Simulate internal/admin API validation
  // In real backend, admin auth token or session cookies are checked here
  const product = MOCK_PRODUCTS.find((p) => p.id === id);

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  // Return full administrative record with internal fields
  return NextResponse.json({
    product: {
      ...product,
      _adminAccess: true,
      internalNotes: "Verified for temperature-controlled cold chain logistics.",
    },
  });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const product = MOCK_PRODUCTS.find((p) => p.id === id);
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const updated = {
    ...product,
    ...body,
    updatedAt: new Date().toISOString(),
  };

  return NextResponse.json({ success: true, product: updated });
}
