import backgroundImage from "../assets/images/banner.jpg";

const Home = () => {
  return (
    <>
    <div
      className="relative h-[500px] w-full bg-center bg-no-repeat bg-cover text-white"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center"
      }}
    >

      {/* Centered content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        <h1 className="text-5xl font-extrabold mb-6">
          Empowering Digital Safety
        </h1>
        <p className="text-lg max-w-2xl mb-8">
          Cyber Sentinel is your trusted ally in reporting, understanding, and protecting against cybercrime. Report incidents, stay informed, and safeguard your digital world.
        </p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full text-lg font-semibold">
          Report Now
        </button>
      </div>
    </div>
    <section className="bg-white py-16 px-4">
  <div className="max-w-7xl mx-auto">
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">

      {/* Card 1: Financial Fraud */}
      <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col items-center text-center">
        <div className="text-4xl text-blue-600 mb-4">💲</div>
        <h3 className="text-xl font-semibold mb-2">Financial Fraud</h3>
        <p className="text-gray-600 mb-4">
          Report online scams, banking fraud, investment fraud, and other financial cybercrimes swiftly.
        </p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">
          Register a Complaint
        </button>
      </div>

      {/* Card 2: Harassment or Abuse */}
      <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col items-center text-center">
        <div className="text-4xl text-blue-600 mb-4">🙅‍♀️</div>
        <h3 className="text-xl font-semibold mb-2">Harassment or Abuse</h3>
        <p className="text-gray-600 mb-4">
          Address cyberstalking, online abuse, revenge porn, and other digital harassment incidents.
        </p>
        <div className="flex flex-col gap-2 w-full">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">
            Register & Track
          </button>
        </div>
      </div>

      {/* Card 3: Other Cyber Crimes */}
      <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col items-center text-center">
        <div className="text-4xl text-blue-600 mb-4">💻</div>
        <h3 className="text-xl font-semibold mb-2">Other Cyber Crimes</h3>
        <p className="text-gray-600 mb-4">
          For phishing, hacking, data theft, intellectual property theft, and other digital offenses.
        </p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">
          Register a Complaint
        </button>
      </div>

    </div>
  </div>
</section>

    </>
  );
};

export default Home;
