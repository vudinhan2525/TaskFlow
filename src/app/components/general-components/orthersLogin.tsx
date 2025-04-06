import { LuGithub } from "react-icons/lu";

export default function OrthersLogin() {
  return (
    <div className="mt-6">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-gray-50 text-gray-500">Hoặc đăng nhập với</span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <div>
          <a
            href="#"
            className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <LuGithub className="text-xl" />
          </a>
        </div>

        <div>
          <a
            href="#"
            className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path
                fillRule="evenodd"
                d="M10 0C4.477 0 0 4.477 0 10c0 5.523 4.477 10 10 10 5.523 0 10-4.477 10-10C20 4.477 15.523 0 10 0zm-1.786 15h-2.4V7.8h2.4V15zM5.2 6.714c-.776 0-1.4-.624-1.4-1.4 0-.776.624-1.4 1.4-1.4.775 0 1.4.624 1.4 1.4 0 .776-.625 1.4-1.4 1.4zM15 15h-2.4v-3.5c0-1.764-2.1-1.625-2.1 0V15H8.1V7.8h2.4v1.04c.73-1.431 4.5-1.54 4.5 1.365V15z"
                clipRule="evenodd"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
