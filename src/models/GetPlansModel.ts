export interface PlanDiscountNestedResponseDto {
  id: number;
  name: string | null;
  type: string | null;
  discountAmount: number | null;
  discountPercentage: number | null;
}

export interface GetPlansModel {
  id: string;
  name: string;
  description: string;
  price: number;
  period: 'monthly' | 'yearly';
  features: string[];
  planDiscounts: PlanDiscountNestedResponseDto[];
  buttonText: string;
}
