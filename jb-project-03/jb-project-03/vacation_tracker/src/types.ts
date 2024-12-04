export interface User {
  ID?: number;
  first_name?: string;
  last_name?: string;
  email?: string;
  password?: string;
  repeat_password?: string;
  role?: string;
}

export interface Vacation {
  ID?: number;
  destination?: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  price?: number;
  image?: string;
  user_ids?: Array<number>;
}