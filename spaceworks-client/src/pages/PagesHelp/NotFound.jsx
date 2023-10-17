import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="mt-7 text-center w-full dark:text-white flex items-center justify-center flex-col gap-3">
        <span className="text-9xl">404 <span><i className="bi bi-emoji-frown"></i></span></span>
        <h1 className="text-6xl">Página não encontrada!</h1>
        <Link className="text-red-600 text-xl hover:underline" to='/'>Voltar <i className="bi bi-arrow-return-left"></i></Link>
    </div>
  )
}

export default NotFound;