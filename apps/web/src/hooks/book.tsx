import { useNavigate } from "react-router-dom";

export const useBook = () => {
  const navigate = useNavigate();

  function navigateToRead(id: string | number) {
    navigate(`/viewer/${id}`);
  }

  return {
    navigateToRead,
  };
};
