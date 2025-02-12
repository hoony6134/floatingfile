// import React, { useState } from "react";
// import Button, { ButtonProps } from "@material-ui/core/Button";
// import { Colors, Elevation } from "@floatingfile/common";
// import { makeStyles, withStyles } from "@material-ui/core/styles";
// import CircularProgress from "@material-ui/core/CircularProgress";
// import ReactGA, { EventArgs } from "react-ga";

// const useStyles = makeStyles((theme) => ({
//   loader: {
//     position: "absolute",
//     top: "50%",
//     left: "50%",
//     transform: "translate(-50%, -50%)",
//     height: "24px",
//   },
// }));
// const StyledCircularProgress = withStyles((theme) => ({
//   root: {
//     color: "white",
//   },
// }))(CircularProgress);

// type CustomButtonProps = Omit<ButtonProps, "variant"> & {
//   disableElevation?: boolean;
//   inverse?: boolean;
//   overrideStyles?: any;
//   debounce?: number;
//   isLoading?: boolean;
//   event?: EventArgs;
//   variant: "primary" | "secondary" | "danger" | "success";
// };

// const CustomButton: React.FC<CustomButtonProps> = ({
//   children,
//   variant,
//   disableElevation,
//   inverse,
//   overrideStyles,
//   onClick,
//   debounce = 1,
//   isLoading,
//   event,
//   ...others
// }) => {
//   const cls = useStyles();
//   const style: any = {
//     fontFamily: "DM Sans",
//     fontSize: "14px",
//   };
//   if (variant === "primary") {
//     style.backgroundColor = Colors.PRIMARY;
//     style.color = Colors.WHITE;
//   } else if (variant === "secondary") {
//     style.backgroundColor = Colors.SECONDARY;
//     style.color = Colors.WHITE;
//   } else if (variant === "danger") {
//     style.backgroundColor = Colors.DANGER;
//     style.color = Colors.WHITE;
//   } else if (variant === "success") {
//     style.backgroundColor = Colors.SUCCESS;
//     style.color = Colors.WHITE;
//   }

//   if (inverse) {
//     const tmp = style.backgroundColor;
//     style.backgroundColor = style.color;
//     style.color = tmp;
//   }

//   if (others.disabled) {
//     style.opacity = 0.7;
//   }

//   const [debouncing, setDebouncing] = useState(false);

//   function debouncedOnClick(e: React.MouseEvent<HTMLButtonElement>) {
//     if (debouncing) return;
//     if (event) {
//       // Track button click event
//       ReactGA.event(event);
//     }
//     setDebouncing(true);
//     setTimeout(() => setDebouncing(false), debounce * 1000);
//     if (onClick) onClick(e);
//   }

//   return (
//     <Button
//       style={{
//         boxShadow: disableElevation || others.disabled ? "" : Elevation.TWO,
//         ...style,
//         ...overrideStyles,
//         whiteSpace: "nowrap",
//       }}
//       onClick={debouncedOnClick}
//       {...others}
//     >
//       <span style={{ opacity: isLoading ? 0 : 1 }}>{children}</span>
//       <span className={cls.loader}>
//         {isLoading && <StyledCircularProgress size={24} />}
//       </span>
//     </Button>
//   );
// };

// export default CustomButton;

import React from "react";
import {
  Button as ChakraButton,
  ButtonProps as ChakraButtonProps,
  forwardRef,
} from "@chakra-ui/react";

export type ButtonProps = ChakraButtonProps;

const Button = forwardRef<ButtonProps, "button">(
  ({ colorScheme, children, ...rest }, ref) => {
    if (colorScheme === "white") {
      return (
        <ChakraButton
          ref={ref}
          bg="white"
          color="black"
          _hover={{
            backgroundColor: "gray.200",
          }}
          {...rest}
        >
          {children}
        </ChakraButton>
      );
    }
    if (colorScheme === "black") {
      return (
        <ChakraButton
          ref={ref}
          bg="black"
          color="white"
          _hover={{
            backgroundColor: "gray.800",
          }}
          {...rest}
        >
          {children}
        </ChakraButton>
      );
    }
    return (
      <ChakraButton ref={ref} colorScheme={colorScheme} {...rest}>
        {children}
      </ChakraButton>
    );
  }
);

export default Button;
