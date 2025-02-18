export default function PanelMembers() {
  const panelMembers = [
    { designation: "President", image: "https://www.aust.edu/storage/files/WvpySTvo1RoVm7xjJSIcT2os00QCNFmXbGOccM3j.jpg" },
    { designation: "Treasurer", image: "https://www.aust.edu/storage/files/LFw28wyWAvPhqHfyiJomOBT69LSEmXcillPZZSlM.jpg" },
    { designation: "Vice President", image: "https://www.aust.edu/storage/files/vkcY8DCmmv161AmpmvWmcAKxaKIFeNFIwonCTb5G.jpg" },
    { designation: "General Secretary", image: "https://www.aust.edu/storage/files/ZiB6sr0h7PRtwcK8aSO5Z2ujuv005s27a5M3Ap9e.jpg" },
    { designation: "Joint Secretary", image: "https://www.aust.edu/storage/files/srIuAoyEkVOjJSgMlyjuttBc3eQi1KJAGUKbxPrj.jpg" },
    // Executive Members
    { designation: "Joint Secretary", image: "https://www.aust.edu/storage/files/6Bcze7OFTCDYRvd15FDVjIqNLZH6wRIPGJucDrrG.jpg" },
    { designation: "Executive", image: "https://www.aust.edu/storage/files/KgoiPlnLFuT2SU3VJM89J1nX0pEyvCpgKEHQLc0q.jpg" },
    { designation: "Executive", image: "https://www.aust.edu/storage/files/XucjBypcLZ18OMJ3ZcpTEPd9JTNQxeFbtyOvGyrt.jpg" },
    { designation: "Executive", image: "https://www.aust.edu/storage/files/6SRt4xyEi0qMsTllJKpo4fA1EmD5BtC70jgDihDk.jpg" },
    { designation: "Executive", image: "https://www.aust.edu/storage/files/qaqU769v64uHxIXRm7KEGPih0ROfa747WDxr8LEQ.jpg" },
    { designation: "Executive", image: "https://www.aust.edu/storage/files/PPwj7H8MpVrOuE25E8iofp5qdgbPyEptIrpB00GU.jpg" },
  ];

  // Group members by designation
  const groupedMembers = panelMembers.reduce((acc, member) => {
    if (!acc[member.designation]) {
      acc[member.designation] = [];
    }
    acc[member.designation].push(member);
    return acc;
  }, {});

  return (
    <div className="p-4 container mx-auto">
      <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold mb-8 text-center">
        Panel Members of Spring 24
      </h1>

      {Object.entries(groupedMembers).map(([designation, members]) => (
        <section key={designation} className="mb-8">
          <h2 className="text-xl md:text-2xl font-semibold mb-4">{designation}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {members.map((member, index) => (
              <div key={index}>
                <img
                  src={member.image}
                  alt={`${designation} ${index + 1}`}
                  className="w-full h-auto rounded-lg shadow-md"
                />
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}



