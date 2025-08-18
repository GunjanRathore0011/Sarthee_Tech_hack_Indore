import React from "react";

const cyberCases = [
  
  {
    region: "Indore",
    title: "Indore man arrested for ₹2.21 crore share-trading fraud",
    summary:
      "Abhishek Bhatt, 40, was arrested for defrauding a Mumbai businessman and others with fake unlisted company shares using forged documents.",
    date: "August 18, 2025",
  },
  {
    region: "Indore",
    title: "₹2.73 crore recovered for cyber fraud victims in Indore",
    summary:
      "Indore Crime Branch’s Fraud Investigation Cell successfully recovered funds between Jan-Apr 2025 under the 'Cyber Pathshala' awareness drive.",
    date: "August 2025",
  },
  {
    region: "Indore",
    title: "Cyber fraudsters dupe 4,500 people of ₹40 crore in 6 months",
    summary:
      "Indore scammers ran 'digital arrest', fake app, and loan scams. Authorities recovered ₹6.33 crore and arrested accomplices linked to the crimes.",
    date: "August 2025",
  },
];

const TrendingCases = () => {
  return (
    <section className="max-w-6xl mx-auto py-16 px-4">
      <h2 className="text-3xl font-semibold text-center mb-4">
        Trending Cybercrime Cases
      </h2>
      <p className="text-center text-gray-600 mb-12">
        Explore recent incidents, their devastating impacts, and crucial lessons
        learned to enhance your digital resilience.
      </p>

      <div className="grid md:grid-cols-3 gap-8">
        {cyberCases.map((caseItem, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition transform hover:scale-105 overflow-hidden"
          >
            {/* Image Placeholder */}
            <img
              src=""
              alt={caseItem.title}
              className="w-full h-40 object-cover bg-gray-200"
            />

            {/* Card Content */}
            <div className="p-6">
              <span className="text-sm text-blue-600 font-medium">
                {caseItem.region} • {caseItem.date}
              </span>
              <h3 className="text-lg font-bold mt-2 mb-2 text-gray-900">
                {caseItem.title}
              </h3>
              <p className="text-gray-600 text-sm">{caseItem.summary}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TrendingCases;
