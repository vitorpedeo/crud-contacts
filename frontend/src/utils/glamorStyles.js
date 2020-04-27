import { css } from "glamor";

export const successToast = {
  className: css({
    background: "#00ff00",
  }),
  bodyClassName: css({
    color: "#fff",
    fontWeight: "bold",
  }),
};

export const errorToast = {
  className: css({
    background: "#dd2c00",
  }),
  bodyClassName: css({
    color: "#fff",
    fontWeight: "bold",
  }),
};
