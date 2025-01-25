import { BsArrowRight } from 'react-icons/bs';
import ContactForm from './ContactForm';
import SocialMedia from './SocailMedia';

export default function Contact() {
  return (
    <>
      {/* Desktop Screen */}
      <section className="hidden lg:flex items-center h-screen">
        <section className="w-1/2 p-8 pr-24 flex justify-end items-center">
          <div className="flex flex-col items-start max-w-md">
            <h2 className="text-4xl font-bold text-gray-800 mb-4 ">
              Let’s make something new, different, and more meaningful.
            </h2>
            <p className="text-gray-600 mb-6 text-2xl font-bold font-caviateFont">
              Whether you have a project in mind, a question, or just want to say hello, I’d love to hear from you.
            </p>
            <button className="flex items-center bg-highLighter hover:bg-[#ff577f] text-white font-bold py-2 px-4 rounded-full shadow-lgtransition-colors">
              Say Hello <BsArrowRight className="ml-2" />
            </button>
          </div>
        </section>
        <section className="w-1/2">
          <ContactForm />
        </section>
      </section>

      {/* Mobile Screen */}
      <main className="flex flex-col items-center justify-center lg:hidden">
        <section className="w-full p-8 text-center">
          <div className="flex flex-col items-start max-w-md">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Let’s make something new, different, and more meaningful.
            </h2>
            <p className="text-lg text-gray-600 mb-6 font-caviateFont">
              Whether you have a project in mind, a question, or just want to say hello, I’d love to hear from you.
            </p>
            <button className="flex items-center bg-highLighter hover:bg-[#ff577f] text-white py-2 px-4 rounded-full shadow-lg transition-colors">
              Say Hello <BsArrowRight className="ml-2" />
            </button>
          </div>
        </section>
        <section className="w-full">
          <ContactForm />
        </section>
      </main>
      <section className="socialMedia bg-gray-100 flex-none w-full h-[12rem] lg:h-[11rem]">
        <SocialMedia />
      </section>
    </>
  );
}
