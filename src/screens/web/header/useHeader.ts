import { useState } from "react";
import { useAppSelector } from "../../../redux/hooks/hooks";

const useHeader = () => {
  const userDetails = useAppSelector(state => state.user);

  return {userDetails};
};
export default useHeader;

