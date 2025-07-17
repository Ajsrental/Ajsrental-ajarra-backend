// AUTHENTICATION

// Sign Up
// POST /api/v1/auth/sign-up
export interface SignUpRequestBody {
  firstName: string;
  middleName?: string;
  phone?: string;
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
  phone: string;
  role: "CLIENT" | "VENDOR" | "ADMIN";
  createdAt: string;
  updatedAt: string;
  message: string;
}

// Send OTP
// POST /api/v1/auth/send-otp
export interface SendOtpRequestBody {
  email?: string;
  phone?: string;
  country?: string;
}
export interface SendOtpSuccessResponse {
  status: "ok";
  message?: string;
  data?: any; // Can be refined based on your OTP provider's response
}

// Verify OTP
// POST /api/v1/auth/verify-otp
export interface VerifyOtpRequestBody {
  email?: string;
  phone?: string;
  otp: string;
}
export interface VerifyOtpSuccessResponse {
  status: "ok";
  message: string;
  data?: any;
}

// Resend OTP
// POST /api/v1/auth/resend-otp
export interface ResendOtpRequestBody {
  email?: string;
  phone?: string;
  country?: string;
}
export interface ResendOtpSuccessResponse {
  status: "ok";
  message: string;
  data?: any;
}

// Forgot Password
// POST /api/v1/auth/forgot-password
export interface ForgotPasswordRequestBody {
  email: string;
}
export interface ForgotPasswordSuccessResponse {
  status: "success";
  message: string;
  token?: string; // Optionally include token for dev/testing
}

// Reset Password
// POST /api/v1/auth/reset-password/:token
export interface ResetPasswordRequestBody {
  password: string;
}
export interface ResetPasswordSuccessResponse {
  status: "success";
  message: string;
}

// Login

// POST /api/v1/auth/login
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

// Set Role

// POST /api/v1/auth/set-role
export interface SetRoleRequestBody {
  role: "CLIENT" | "VENDOR" | "ADMIN";
}

export interface SetRoleSuccessResponse {
  status: "ok";
  message: string;
  user: {
    id: string;
    email: string;
    role: "CLIENT" | "VENDOR" | "ADMIN";
  };
}

// VENDORS
// Create Vendors
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

// Update Vendors
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

// Get Profile Information
// GET /api/v1/vendor/get-profile-information
export interface GetProfileInformationRequest { } // No request body, uses JWT for user

export interface GetProfileInformationResponse {
  email: string;
  phone: string;
  vendorId: string;
  serviceName: string;
  serviceLocation: string;
  serviceDescription: string;
}

// Update Email
// PATCH /api/v1/vendor/update-email
export interface UpdateEmailRequest {
  email: string;
}

export interface UpdateEmailResponse {
  status: "ok";
  message: string;
  user: {
    id: string;
    email: string;
  };
}

// Update Phone Number
// PATCH /api/v1/vendor/update-phone-number
export interface UpdatePhoneNumberRequest {
  phone: string;
}

export interface UpdatePhoneNumberResponse {
  status: "ok";
  message: string;
  user: {
    id: string;
    phone: string;
  };
}

// Create Payout Account
// POST /api/v1/vendor/create-payout-account
export interface CreatePayoutAccountRequest {
  bankName: string;
  accountHolderName: string;
  accountNumber: string;
  accountType: "SAVINGS" | "CURRENT";
  utilityBillUrl?: string;
  validIdUrl?: string;
  businessCertUrl?: string;
}
export interface CreatePayoutAccountResponse {
  id: string;
  vendorId: string;
  bankName: string;
  accountHolderName: string;
  accountNumber: string;
  accountType: "SAVINGS" | "CURRENT";
  utilityBillUrl?: string;
  validIdUrl?: string;
  businessCertUrl?: string;
  verificationStatus: string;
  createdAt: string;
  updatedAt: string;
}

// Get Payout Information
// GET /api/v1/vendor/get-payout-information
export interface GetPayoutInformationRequest { } // No request body, uses JWT for user

export interface GetPayoutInformationResponse {
  id: string;
  vendorId: string;
  bankName: string;
  accountHolderName: string;
  accountNumber: string;
  accountType: "SAVINGS" | "CURRENT";
  utilityBillUrl?: string;
  validIdUrl?: string;
  businessCertUrl?: string;
  verificationStatus: string;
  createdAt: string;
  updatedAt: string;
}

// Update Payout Information
// PATCH /api/v1/vendor/update-payout-information
export interface UpdatePayoutInformationRequest {
  bankName: string;
  accountHolderName: string;
  accountNumber: string;
  accountType: "SAVINGS" | "CURRENT";
}
export interface UpdatePayoutInformationResponse {
  status: "ok";
  message: string;
  updatedCount: number;
}

// Services 
// Create service
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

// Get Services
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

// Update Service Description
// PATCH /api/v1/vendor/update-service-description
export interface UpdateServiceDescriptionRequest {
  description: string;
}

export interface UpdateServiceDescriptionResponse {
  status: "ok";
  message: string;
}

// Update Service Location
// PATCH /api/v1/vendor/update-service-location
export interface UpdateServiceLocationRequest {
  location: string;
}

export interface UpdateServiceLocationResponse {
  status: "ok";
  message: string;
}

// Update Service Name
// PATCH /api/v1/vendor/update-service-name
export interface UpdateServiceNameRequest {
  name: string;
}

export interface UpdateServiceNameResponse {
  status: "ok";
  message: string;
}

// Admin 
// Get Vendors
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

// Update Vendor Status
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