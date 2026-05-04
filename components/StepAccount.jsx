import { Eye, EyeOff } from "lucide-react";

export default function StepAccount({
  email,
  setEmail,
  password,
  setPassword,
  isPasswordVisible,
  setIsPasswordVisible,
}) {
  return (
    <div className="flex flex-col gap-3">
      <input
        placeholder="Adresse e-mail"
        type="email"
        value={email}
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
          onChange={(e) => setPassword(e.target.value)}
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
