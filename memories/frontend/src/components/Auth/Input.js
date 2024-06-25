import React from "react";
import { TextField, Grid, InputAdornment, IconButton } from "@material-ui/core";
import { VisibilityOffOutlined, VisibilityOutlined } from "@material-ui/icons";

export const Input = ({
  name,
  label,
  handleChange,
  type,
  handleShowPassword,
  half,
  autoFocus,
  helperText,
  error,
}) => (
  <Grid item xs={12} sm={half ? 6 : 12}>
    <TextField
      name={name}
      onChange={handleChange}
      variant="outlined"
      required
      fullWidth
      label={label}
      autoFocus={autoFocus}
      type={type}
      helperText={helperText}
      error={error}
      InputProps={
        name === "password"
          ? {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleShowPassword}>
                    {type === "password" ? (
                      <VisibilityOutlined />
                    ) : (
                      <VisibilityOffOutlined />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }
          : null
      }
    />
  </Grid>
);
