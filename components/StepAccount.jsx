import { Eye, EyeOff } from "lucide-react";
import { useRef } from "react";

export default function StepAccount({
  email,
  setEmail,
  password,
  setPassword,
  isPasswordVisible,
  setIsPasswordVisible,
  handleLogin,
  handleSignup,
  isSignup,
}) {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  return (
    <div className="flex flex-col gap-3">
      <input
        placeholder="Adresse e-mail"
        type="email"
        ref={emailRef}
        value={email}
        returnKeyType="next"
        onSubmit={(e) => passwordRef.current?.focus()}
        onChange={(e) => setEmail(e.target.value)}
        className="text-secondary p-2 input rounded-md"
        autoCapitalize="none"
        autoCorrect="off"
      />
      <div className="flex flex-row items-center bg-white rounded-md">
        <input
          placeholder="Mot de passe"
          type={isPasswordVisible ? "text" : "password"}
          value={password}
          ref={passwordRef}
          onChange={(e) => setPassword(e.target.value)}
          onSubmit={(e) => (isSignup ? handleSignup(e) : handleLogin(e))}
          returnKeyType="go"
          className="text-secondary p-2 input rounded-md flex-1"
        />
        <button
          type="button"
          onClick={() => setIsPasswordVisible((visibility) => !visibility)}
          className="text-secondary hover:text-secondaryLight p-2"
        >
          {isPasswordVisible ? <EyeOff size={25} /> : <Eye size={25} />}
        </button>
      </div>
    </div>
  );
}
