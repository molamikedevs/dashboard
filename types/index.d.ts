export type Customer = {
  $id: string;
  name: string;
  email: string;
  image_url: string;
};

export type Invoice = {
  $id: string;
  customer_id: string;
  amount: number;
  date: string;
  status: "pending" | "paid";
};

export type Revenue = {
  month: string;
  revenue: number;
};

export type LatestInvoice = {
  $id: string;
  name: string;
  image_url: string;
  email: string;
  amount: number;
};

// The database returns a number for amount, but we later format it to a string with the formatCurrency function
export type LatestInvoiceRaw = Omit<LatestInvoice, "amount"> & {
  amount: number;
};

export type InvoicesTable = {
  $id: string;
  customer_id: string;
  name: string;
  email: string;
  image_url: string;
  date: string;
  amount: number;
  status: "pending" | "paid";
};

export type FilterInvoice = {
  name: string;
  email: string;
  amount: number;
  date: string;
  status: "pending" | "paid";
};

export type CustomersTableType = {
  $id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: number;
  total_paid: number;
};

export type FormattedCustomersTable = {
  $id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: string;
  total_paid: string;
};

export type CustomerField = {
  $id: string;
  name: string;
  email: string;
  image_url: string;
};

export type InvoiceForm = {
  $id: string[];
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

export interface AppwriteError extends Error {
  code?: number;
  type?: string;
  response?: {
    message?: string;
  };
}

export interface AuthErrorResponse {
  success: false;
  error: string;
}
// Response types
export interface AuthSuccessResponse<T = Models.Session | Models.User> {
  success: true;
  session?: Models.Session;
  user?: Models.User;
}

export type AuthResponse<T = Models.Session | Models.User> =
  | AuthSuccessResponse<T>
  | AuthErrorResponse;
