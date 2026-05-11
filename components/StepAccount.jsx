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
        className="field-input text-slate-900"
        autoCapitalize="none"
        autoCorrect="off"
      />
      <div className="flex flex-row items-center rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface-strong)]">
        <input
          placeholder="Mot de passe"
          type={isPasswordVisible ? "text" : "password"}
          value={password}
          ref={passwordRef}
          onChange={(e) => setPassword(e.target.value)}
          onSubmit={(e) => (isSignup ? handleSignup(e) : handleLogin(e))}
          returnKeyType="go"
          className="text-[var(--text)] p-3 flex-1 border-none focus:ring-0 bg-transparent"
        />
        <button
          type="button"
          onClick={() => setIsPasswordVisible((visibility) => !visibility)}
          className="text-slate-500 hover:text-slate-700 p-3"
        >
          {isPasswordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
    </div>
  );
}
