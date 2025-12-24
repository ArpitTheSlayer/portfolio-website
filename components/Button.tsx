import Link from "next/link";

const Button = ({ text = "Button", link = "#" }: any) => {
  return (
    <Link href={link}>
      <button className="bg-tia-maria-500 hover:bg-tia-maria-600 transition-all text-tia-maria-50 px-6 py-2 rounded-sm cursor-pointer">
        {text}
      </button>
    </Link>
  );
};

export default Button;
