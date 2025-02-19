import { FC, useCallback } from "react";
import { SubmitHandler, FormProvider, useForm } from "react-hook-form";
import Input from "components/forms/Input";
import Button from "@mui/material/Button";
import { EMAIL_REGEX, NAME_REGEX } from "utils/regex";
import { useLoginMutation } from "store/services/auth";
import { useNavigate } from "react-router-dom";

interface ILoginForm {
  email: string;
  name: string;
}

const NAME_RULES = {
  required: "Name is required",
  pattern: {
    value: NAME_REGEX,
    message: "Name must contain only letters and spaces",
  },
};

const EMAIL_RULES = {
  required: "Email is required",
  pattern: {
    value: EMAIL_REGEX,
    message: "Please enter a valid email address",
  },
};

const LoginForm: FC = () => {
  const hookFormMethods = useForm<ILoginForm>();
  const navigate = useNavigate();
  const [login, { isLoading, isError }] = useLoginMutation();

  const onSubmit: SubmitHandler<ILoginForm> = useCallback(
    async (data, e) => {
      try {
        e?.preventDefault();

        await login(data);

        /**
         * Replace login route so that user doesnt go back
         * to login on back press.
         */
        navigate("/search", { replace: true });
      } catch (err) {
        console.error("Login failed:", err);
      }
    },
    [navigate, login],
  );

  return (
    <>
      <h2>Login</h2>
      <FormProvider {...hookFormMethods}>
        <form onSubmit={hookFormMethods.handleSubmit(onSubmit)}>
          <Input
            name="name"
            label="Name"
            type="text"
            rules={NAME_RULES}
            placeholder="ex: John Doe"
          />
          <Input
            name="email"
            label="Email"
            type="email"
            rules={EMAIL_RULES}
            placeholder="ex: john@gmail.com"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isLoading}
            fullWidth
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>
          {isError && <p>Login failed</p>}
        </form>
      </FormProvider>
    </>
  );
};

export default LoginForm;
