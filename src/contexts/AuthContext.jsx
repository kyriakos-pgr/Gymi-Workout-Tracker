import { createContext, useContext, useEffect, useState } from "react";
import { Query } from "react-native-appwrite";

//lib--appwrite
import { account, config, databases, ID } from "../lib/appwrite";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  const getProfile = async (userId) => {
    console.log("SEARCHING PROFILE FOR USERID:", userId);

    const response = await databases.listDocuments(
      config.databaseId,
      config.profilesTableId,
      [Query.equal("userid", userId)],
    );

    console.log("PROFILE RESPONSE:", response.documents);

    if (response.documents.length > 0) {
      setProfile(response.documents[0]);
    } else {
      setProfile(null);
    }
  };

  const checkUser = async () => {
    try {
      const currentUser = await account.get();
      setUser(currentUser);
      await getProfile(currentUser.$id);
    } catch (error) {
      setUser(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  async function register(email, password, name) {
    try {
      const newUser = await account.create(ID.unique(), email, password);

      await databases.createDocument(
        config.databaseId,
        config.profilesTableId,
        ID.unique(),
        {
          userid: newUser.$id,
          username: name,
        },
      );

      await login(email, password);
    } catch (error) {
      throw Error(error.message);
    }
  }

  async function login(email, password) {
    try {
      await account.createEmailPasswordSession(email, password);

      const response = await account.get();
      setUser(response);

      await getProfile(response.$id);
    } catch (error) {
      throw Error(error.message);
    }
  }

  useEffect(() => {
    checkUser();
  }, []);

  async function logout() {
    await account.deleteSession("current");
    setUser(null);
    setProfile(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        logout,
        loading,
        checkUser,
        profile,
        setProfile,
        login,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useUser = () => useContext(AuthContext);
