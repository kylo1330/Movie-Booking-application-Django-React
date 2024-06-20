import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUserFromLocalStorage } from "../../store/authSlice"; // Updated import statement

function AutoLogin(props) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setUserFromLocalStorage());
  }, [dispatch]); // Include dispatch in the dependency array

  return props.children;
}

export default AutoLogin;
