import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Navbar from "scenes/navbar";
import UserSettingsWidget from "scenes/widgets/UserSettingsWidget";

const SettingsPage = () => {
  const [user, setUser] = useState(null);
  const { userId } = useParams();
  const token = useSelector((state) => state.token);

  const getUser = async () => {
    const response = await fetch(`http://localhost:3001/users/${userId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setUser(data);
  };

  useEffect(() => {
    getUser();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!user) return null;
    return (
    <Box>
      <Navbar /> 
      <Box width="100%" padding="2rem 6%" gap="0.5rem" justifyContent="center">
          <UserSettingsWidget userId={userId} picturePath={user.picturePath} />
          <Box m="2rem 0" />
      </Box>
    </Box>
    );
}

export default SettingsPage;
