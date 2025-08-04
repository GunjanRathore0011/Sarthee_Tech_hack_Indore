import ComplaintCategory from "@/component/complaintCategory";
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
      <ComplaintCategory></ComplaintCategory>
    </>
  );
};

export default Home;
