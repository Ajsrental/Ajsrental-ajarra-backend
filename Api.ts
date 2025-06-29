// AUTHENTICATION
// POST /api/v1/auth/sign-up)
export interface SignUpRequestBody {
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  password: string;
  role?: "CLIENT" | "VENDOR" | "ADMIN";
}
export interface SignUpSuccessResponse {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  role: "CLIENT" | "VENDOR" | "ADMIN";
  createdAt: string;
  updatedAt: string;
}


// POST /api/v1/auth/login)

export interface LoginRequestBody {
  email: string;
  password: string;
}
export interface LoginSuccessResponse {
  status: "ok";
  data: {
    token: string;
  };
}

// VENDORS
// POST /api/v1/vendor/create)
export interface CreateVendorRequestBody {
  businessName: string;
  rcNumber: string;
  nin: string;
  yearsInBusiness: "ZERO_TO_ONE" | "TWO_TO_FIVE" | "SIX_TO_TEN" | "ELEVEN_TO_TWENTY" | "ABOVE_TWENTY";
  businessCategory: string; // e.g., "RENTALS", "CATERER", etc.
  phoneNumber: string;
  businessAddress: string;
}


export interface CreateVendorResponse {
  id: string;
  businessName: string;
  rcNumber: string;
  nin: string;
  yearsInBusiness: "ZERO_TO_ONE" | "TWO_TO_FIVE" | "SIX_TO_TEN" | "ELEVEN_TO_TWENTY" | "ABOVE_TWENTY";
  businessCategory: string;
  phoneNumber: string;
  businessAddress: string;
  userId: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

// PATCH /api/v1/vendor/update)
export interface UpdateVendorRequestBody {
  businessName?: string;
  rcNumber?: string;
  nin?: string;
  yearsInBusiness?: "ZERO_TO_ONE" | "TWO_TO_FIVE" | "SIX_TO_TEN" | "ELEVEN_TO_TWENTY" | "ABOVE_TWENTY";
  businessCategory?: string; // e.g., "RENTALS", "CATERER", etc.
  phoneNumber?: string;
  businessAddress?: string;
}
export interface UpdateVendorSuccessResponse {
  message: string; // e.g., "Vendor updated successfully"
}

// Services 
// Post /api/v1/vendor/create-service
export interface CreateServiceRequest {
  name: string;
  description: string;
  images: string[];
  serviceCategory:
  | "BeautyAndStyling"
  | "DecorAndLightening"
  | "EntertainmentAndMedia"
  | "FoodAndBeverage"
  | "Logistics"
  | "PlanningAndCoordination";
  location: string;
  pricingModel: "FixedPrice" | "PriceRange" | "StartingFrom" | "CustomQuote";
  minPrice?: number;
  maxPrice?: number;
  fixedPrice?: number;
  startingPrice?: number;
}

export interface CreateServiceResponse {
  id: string;
  name: string;
  description: string;
  images: string[];
  serviceCategory:
  | "BeautyAndStyling"
  | "DecorAndLightening"
  | "EntertainmentAndMedia"
  | "FoodAndBeverage"
  | "Logistics"
  | "PlanningAndCoordination";
  location: string;
  pricingModel: "FixedPrice" | "PriceRange" | "StartingFrom" | "CustomQuote";
  minPrice?: number | null;
  maxPrice?: number | null;
  fixedPrice?: number | null;
  startingPrice?: number | null;
  vendorId: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

// Get /api/v1/vendor/get-services
export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  images: string[];
  serviceCategory:
  | "BeautyAndStyling"
  | "DecorAndLightening"
  | "EntertainmentAndMedia"
  | "FoodAndBeverage"
  | "Logistics"
  | "PlanningAndCoordination";
  location: string;
  pricingModel: "FixedPrice" | "PriceRange" | "StartingFrom" | "CustomQuote";
  minPrice?: number | null;
  maxPrice?: number | null;
  fixedPrice?: number | null;
  startingPrice?: number | null;
  vendorId: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetServicesResponse {
  services: ServiceItem[];
}

// Admin 
// GET /api/v1/admin/vendors
export interface Vendor {
  id: string;
  businessName: string;
  rcNumber: string;
  nin: string;
  yearsInBusiness: "ZERO_TO_ONE" | "TWO_TO_FIVE" | "SIX_TO_TEN" | "ELEVEN_TO_TWENTY" | "ABOVE_TWENTY";
  businessCategory: string;
  phoneNumber: string;
  businessAddress: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  userId: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface GetAllVendorsResponse {
  vendors: Vendor[];
}

// PATCH /api/v1/admin/vendor/status
export interface UpdateVendorStatusRequest {
  vendorId: string;
  status: "APPROVED" | "REJECTED";
}

export interface Vendor {
  id: string;
  businessName: string;
  rcNumber: string;
  nin: string;
  yearsInBusiness: "ZERO_TO_ONE" | "TWO_TO_FIVE" | "SIX_TO_TEN" | "ELEVEN_TO_TWENTY" | "ABOVE_TWENTY";
  businessCategory: string;
  phoneNumber: string;
  businessAddress: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  userId: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface UpdateVendorStatusResponse {
  message: string;
  vendor: Vendor;
}