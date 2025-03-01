import { FaFacebook, FaTwitter, FaInstagram, FaGithub } from "react-icons/fa"

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-5 w-full mt-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">Connect With Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-blue-400 transition-colors duration-300">
                <FaFacebook size={24} />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors duration-300">
                <FaTwitter size={24} />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors duration-300">
                <FaInstagram size={24} />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors duration-300">
                <FaGithub size={24} />
                <span className="sr-only">GitHub</span>
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center">
          <p>&copy; {new Date().getFullYear()} TypeSpeed. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

