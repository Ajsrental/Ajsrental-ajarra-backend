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