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

// Change Password
// POST /api/v1/auth/change-password

export interface ChangePasswordRequestBody {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordSuccessResponse {
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

export type ServiceName =
  | "DJ"
  | "ENTERTAINMENT"
  | "MC_HOST"
  | "PHOTO_BOOTH"
  | "PHOTOGRAPHER"
  | "VIDEOGRAPHER"
  | "ASOEBI"
  | "COSTUMES"
  | "FABRICS"
  | "HAIR_STYLIST"
  | "MAKEUP_ARTIST"
  | "WEDDING_DRESSES"
  | "EVENT_DECORATOR"
  | "FLORIST"
  | "LIGHTING"
  | "RENTALS"
  | "SOUND_AND_PA_SYSTEM_PROVIDER"
  | "SOUVENIRS"
  | "BAKER"
  | "BARTENDER"
  | "CATERER"
  | "LOGISTICS_SERVICE"
  | "TRANSPORTATION"
  | "EVENT_PLANNER"
  | "SECURITY"
  | "USHERS";

// VENDORS
// Create Vendors
// POST /api/v1/vendor/create)
export interface CreateVendorRequestBody {
  businessName: string;
  rcNumber: string;
  nin: string;
  yearsInBusiness: "LESS_THAN_ONE" | "ONE_TO_TWO" | "TWO_TO_FIVE" | "FIVE_TO_TEN" | "TEN_PLUS";
  serviceCategory:
  | "Beauty_And_Styling"
  | "Decor_And_Lightening"
  | "Entertainment_And_Media"
  | "Food_And_Beverage"
  | "Logistics"
  | "Planning_And_Coordination";
  phoneNumber: string;
  businessAddress: string;
  status?: "PENDING" | "APPROVED" | "REJECTED";
  services: ServiceName[]; // e.g. ["DJ", "MC_HOST"]
}


export interface CreateVendorResponse {
  id: string;
  businessName: string;
  rcNumber: string;
  nin: string;
  yearsInBusiness: "LESS_THAN_ONE" | "ONE_TO_TWO" | "TWO_TO_FIVE" | "FIVE_TO_TEN" | "TEN_PLUS";
  serviceCategory:
  | "Beauty_And_Styling"
  | "Decor_And_Lightening"
  | "Entertainment_And_Media"
  | "Food_And_Beverage"
  | "Logistics"
  | "Planning_And_Coordination";
  phoneNumber: string;
  businessAddress: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  userId: string;
  createdAt: string;
  updatedAt: string;
}

// Update Vendors
// PATCH /api/v1/vendor/update)
export interface UpdateVendorRequestBody {
  businessName?: string;
  rcNumber?: string;
  nin?: string;
  yearsInBusiness?: "LESS_THAN_ONE" | "ONE_TO_TWO" | "TWO_TO_FIVE" | "FIVE_TO_TEN" | "TEN_PLUS";
  serviceCategory:
  | "Beauty_And_Styling"
  | "Decor_And_Lightening"
  | "Entertainment_And_Media"
  | "Food_And_Beverage"
  | "Logistics"
  | "Planning_And_Coordination";
  phoneNumber?: string;
  businessAddress?: string;
  status?: "PENDING" | "APPROVED" | "REJECTED";
  services?: ServiceName[]; // e.g. ["DJ", "MC_HOST"]
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

// Get Bookings
// GET /api/v1/vendor/get-bookings
export interface GetBookingsRequest { } // No request body, uses JWT for user

export interface BookingItem {
  id: string;
  vendorId: string;
  service: string;
  clientName?: string | null;
  bookingDate: string;
  notes?: string | null;
  status: string;
  amount?: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface GetBookingsResponse {
  bookings: BookingItem[];
}

// Get Vendor Notifications
// GET /api/v1/vendor/get-notifications
export interface GetVendorNotificationsRequest { } // No request body, uses JWT for user

export interface NotificationItem {
  id: string;
  userId: string;
  bookingId?: string | null;
  type: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface GetVendorNotificationsResponse {
  notifications: NotificationItem[];
}

// Services 
// Create service
// Post /api/v1/vendor/create-service
export interface CreateServiceRequest {
  name: string;
  description: string;
  images: string[];
  location: string;
  pricingModel: "FixedPrice" | "PriceRange" | "StartingFrom" | "CustomQuote";
  availableHours: "ByAppointmentOnly" | "OpenForSelectedHours" | "AlwaysAvailable";
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
  location: string;
  pricingModel: "FixedPrice" | "PriceRange" | "StartingFrom" | "CustomQuote";
  availableHours: "ByAppointmentOnly" | "OpenForSelectedHours" | "AlwaysAvailable";
  minPrice?: number | null;
  maxPrice?: number | null;
  fixedPrice?: number | null;
  startingPrice?: number | null;
  vendorId: string;
  createdAt: string;
  updatedAt: string;
}

// Get Services
// Get /api/v1/vendor/get-services
export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  images: string[];
  location: string;
  pricingModel: "FixedPrice" | "PriceRange" | "StartingFrom" | "CustomQuote";
  availableHours: "ByAppointmentOnly" | "OpenForSelectedHours" | "AlwaysAvailable";
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

// Get Vendor Contract Information
// Get /api/v1/vendor/get-contract-details
export interface ContractItem {
  id: string;
  bookingId: string;
  vendorId: string;
  clientName: string;
  clientEmail: string;
  service: string;
  date: string; // ISO string
  budget: number;
  location: string;
  deliverables: string[];
  termsAndConditions: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  createdAt: string;
  updatedAt: string;
}

export interface GenerateContractRequest {
  bookingId: string;
}

export interface GenerateContractResponse {
  contract: ContractItem;
}

// Admin 
// Get Vendors
// GET /api/v1/admin/vendors
export interface Vendor {
  id: string; 
  businessName: string;
  rcNumber: string;
  nin: string;
  yearsInBusiness: "LESS_THAN_ONE" | "ONE_TO_TWO" | "TWO_TO_FIVE" | "FIVE_TO_TEN" | "TEN_PLUS";
  serviceCategory:
  | "Beauty_And_Styling"
  | "Decor_And_Lightening"
  | "Entertainment_And_Media"
  | "Food_And_Beverage"
  | "Logistics"
  | "Planning_And_Coordination";
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
  yearsInBusiness: "LESS_THAN_ONE" | "ONE_TO_TWO" | "TWO_TO_FIVE" | "FIVE_TO_TEN" | "TEN_PLUS";
  serviceCategory:
  | "Beauty_And_Styling"
  | "Decor_And_Lightening"
  | "Entertainment_And_Media"
  | "Food_And_Beverage"
  | "Logistics"
  | "Planning_And_Coordination";
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

