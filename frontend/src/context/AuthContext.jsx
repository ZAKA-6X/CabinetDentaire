import { createContext, useState, useContext } from 'react';

// ─────────────────────────────────────────
// Création de la "boîte" qui va contenir
// les informations de l'utilisateur connecté
// ─────────────────────────────────────────
const AuthContext = createContext();

// ─────────────────────────────────────────
// AuthProvider — composant qui entoure
// toute l'application pour partager
// les infos de connexion partout
// ─────────────────────────────────────────
export function AuthProvider({ children }) {

  // Récupérer l'utilisateur sauvegardé
  // Si l'utilisateur a déjà été connecté,
  // on récupère ses infos depuis localStorage
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  // Récupérer le token sauvegardé
  // Le token prouve que l'utilisateur est connecté
  const [token, setToken] = useState(
    () => localStorage.getItem('token') || null
  );

  // ─────────────────────────────────────────
  // Fonction LOGIN
  // Appelée après une connexion réussie
  // Sauvegarde l'utilisateur et le token
  // ─────────────────────────────────────────
  const login = (userData, tokenValue) => {
    // Sauvegarder dans React (mise à jour immédiate)
    setUser(userData);
    setToken(tokenValue);
    // Sauvegarder dans localStorage (persist après refresh)
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', tokenValue);
  };

  // ─────────────────────────────────────────
  // Fonction LOGOUT
  // Appelée quand l'utilisateur se déconnecte
  // Supprime toutes les infos de connexion
  // ─────────────────────────────────────────
  const logout = () => {
    // Vider React
    setUser(null);
    setToken(null);
    // Vider localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  // ─────────────────────────────────────────
  // Rendre les données accessibles
  // à tous les composants enfants
  // value = ce qu'on partage avec toute l'app
  // ─────────────────────────────────────────
  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─────────────────────────────────────────
// Hook personnalisé useAuth
// Permet d'utiliser le contexte facilement
// dans n'importe quelle page :
// const { user, login, logout } = useAuth();
// ─────────────────────────────────────────
export const useAuth = () => useContext(AuthContext);