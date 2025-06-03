import logo from  '/logo.svg';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 pl-8 bg-white shadow-md flex justify-center md:justify-start ">
      <img
        src={logo}
        alt="airifi"
        width={100}
        height={100}
      />
    </header>
  );
}
