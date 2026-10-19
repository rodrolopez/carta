import { Outlet } from 'react-router-dom';

const MenuLayout = () => {
  return (
    <div className="min-h-screen font-sans text-white bg-resto-dark">
      <header className="sticky top-0 z-10 p-4 text-center border-b shadow-md bg-resto-black border-resto-red">
        <h1 className="text-4xl font-black tracking-widest uppercase text-resto-red" style={{ fontFamily: 'impact, sans-serif' }}>AQUI</h1>
        <p className="text-sm tracking-[0.3em] font-light mt-1">LOMOS & PIZZAS</p>
      </header>

      <main className="max-w-md p-4 pb-24 mx-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default MenuLayout;