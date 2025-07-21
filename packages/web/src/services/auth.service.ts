import { LoginDto, RegisterDto } from '@/common/dtos/auth.dto';
import { API_URL, TOKEN_STORAGE_KEY } from '@/constants';
import { AuthModel } from '@/common/models/auth.model';
import { UserModel } from '@/common/models/user.model';

export const getHeaders = () => {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
};

export const AuthService = new (class {
  public async me(): Promise<UserModel> {
    const response = await fetch(`${API_URL}/me`, {
      method: 'GET',
      headers: getHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const message = errorData?.error || 'Unknown error';
      throw new Error(message);
    }

    return response.json();
  }

  public login = async (payload: LoginDto): Promise<AuthModel> => {
    const response = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      const message = errorData?.error || 'Unknown error';
      throw new Error(message);
    }

    return response.json();
  };

  public async register(payload: RegisterDto): Promise<AuthModel> {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      const message = errorData?.error || 'Unknown error';
      throw new Error(message);
    }

    return response.json();
  }
})();
