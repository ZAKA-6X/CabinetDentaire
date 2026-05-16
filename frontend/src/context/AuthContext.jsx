import { createContext, useState, useEffect, useContext } from 'react';
import api from '../api';

const AuthContext = createContext();

export function AuthProvider({ children }) {

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState(
    () => localStorage.getItem('token') || null
  );

  // Vérifier la validité du token au démarrage de l'application
  useEffect(() => {
    if (token) {
      api.get('/me')
        .then(res => {
          const merged = { ...res.data.user, ...res.data.profile };
          setUser(merged);
          localStorage.setItem('user', JSON.stringify(merged));
        })
        .catch(() => logout());
    }
  }, []);

  // Connexion — appel API + stockage token + récupération profil
  const login = async (email, password) => {
    const res = await api.post('/login', { email, password });
    const { token: newToken, user: userData } = res.data;

    // Stocker le token avant l'appel /me pour que l'intercepteur l'injecte
    localStorage.setItem('token', newToken);
    setToken(newToken);

    // Récupérer nom et prénom depuis le profil
    let mergedUser = { ...userData };
    try {
      const profileRes = await api.get('/me');
      mergedUser = { ...userData, ...profileRes.data.profile };
    } catch { /* profil non récupéré — continuer sans nom */ }

    setUser(mergedUser);
    localStorage.setItem('user', JSON.stringify(mergedUser));

    return mergedUser;
  };

  // Inscription — appel API + auto-connexion
  const register = async (data) => {
    const res = await api.post('/register', data);
    const { token: newToken, user: userData } = res.data;

    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // Déconnexion — révocation token côté serveur + nettoyage local
  const logout = async () => {
    await api.post('/logout').catch(() => {});
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const updateUser = (patch) => {
    setUser(prev => {
      const next = { ...prev, ...patch };
      localStorage.setItem('user', JSON.stringify(next));
      return next;
    });
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
