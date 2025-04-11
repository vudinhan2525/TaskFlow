import ReactDOM from "react-dom";
import { ReactNode } from "react";

const ModalPortal = ({ children }: { children: ReactNode }) => {
  return ReactDOM.createPortal(children, document.body);
};

export default ModalPortal;
